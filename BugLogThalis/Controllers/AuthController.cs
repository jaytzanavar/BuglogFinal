using BugLogThalis.Authorization;
using BugLogThalis.Models.Views;
using BugLogThalis.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;


namespace BugLogThalis.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _isrv;
        private readonly IAuthenticationProvider _auth;
        private readonly IConfiguration _config;

        public AuthController(IUserService isrv, IConfiguration config, IAuthenticationProvider auth)
        {
            _isrv = isrv;
            _config = config;
            _auth = auth;
        }

        [AllowAnonymous]
        [HttpPost("token")]
        public IActionResult Token([FromBody] LoginViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = _isrv.GetUserByUsername(model.Username);
                    if (user != null)
                    {
                        if (!user.IsActive)
                        {
                            return BadRequest("Ο λογαριασμός δεν είναι ενεργοποιημένος. Επικοινωνήστε με τον διαχειριστή της εφαρμογής");
                        }
                        if (AuthManager.VerifyHashedPassword(user.PasswordHashed, model.Password))
                        {
                            var userToken = _auth.CreateToken(user);
                            return Ok(new {
                                token = new JwtSecurityTokenHandler().WriteToken(userToken)
                            });
                        }
                        else
                        {
                            return BadRequest("Λάθος όνομα χρήστη ή κωδικός");
                        }
                    }
                    else
                    {
                        return BadRequest("Λάθος όνομα χρήστη ή κωδικός");
                    }
                }
                else
                {
                    return BadRequest("Λάθος όνομα χρήστη ή κωδικός");
                }

            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα στην επιβεβαίωση στοιχείων");
            }
        }
    }
}
