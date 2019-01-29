using BugLogThalis.Models;
using BugLogThalis.Models.Views;
using BugLogThalis.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BugLogThalis.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _usr;

        public UserController(IUserService usrv)
        {
            _usr = usrv;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Δεν βρέθηκε ο χρήστης");
                }

                var result = await _usr.GetUserById(id);
                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

        [HttpGet("foredit/{id}")]
        public async Task<IActionResult> GetUserForEdit(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Δεν βρέθηκε ο χρήστης με αυτό το id");
                }

                var result = await _usr.GetUserById(id);
                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }
        
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserpProfile()
        {        
            try
            {
                if (string.IsNullOrEmpty(User.GetUserId()))
                {
                    return BadRequest("Δεν βρέθηκε το προφιλ του χρήστη");
                }
                
                var result = await _usr.GetUserById(User.GetUserId());
                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

        [HttpGet("{page}/{pagesize}/{activated}/{role}/{search?}")]
        public IActionResult GetPagedData(int page, int pageSize, int activated, int role, string search="")
        {
            try
            {
                var userId = User.GetUserId();
                DataResponse<User> result = _usr.GetUserPagedData(page, pageSize, activated, role, search);

                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα συλλογής δεδομένων!");
            }
        }

        [HttpPost]
        public async Task<IActionResult> NewAdminUser([FromBody] User user)
        {
            try
            {
                if (user.IsValid())
                {
                    var result = await _usr.CreateUser(user);
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Σφάλμα εφαρμογής");
                }
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα Create User");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Σφάλμα δεν υπάρχει αυ΄τός ο χρήστης");
                }
                var result = await _usr.RemoveById(id);

                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής για χρήστη");
            }
        }
        
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("Σφάλμα Χρήστης null");
                }

                if (user.IsValidUpdate())
                {
                    var result = await _usr.Update(user);

                    return Ok(result);
                }
                else
                {
                    return BadRequest("Τα δεδομένα του χρήστη δεν είναι ορθά.");
                }
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }
        
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            try
            {
                if (user.IsValid())
                {
                    var result = await _usr.RegisterUser(user);
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Σφάλμα εφαρμογής");
                }
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα Register");
            }                   
        }





    }
}
