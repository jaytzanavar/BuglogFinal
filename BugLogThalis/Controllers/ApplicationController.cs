using BugLogThalis.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BugLogThalis.Models;


namespace BugLogThalis.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _app;
        private readonly IUserService _usr;

        public ApplicationController(IApplicationService app, IUserService usr)
        {
            _app = app; _usr = usr;
        }
       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Δεν βρέθηκε η εφαρμογή");
                }

                var result = await _app.GetApplicationById(id);
                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Σφάλμα δεν υπάρχει αυτή η εφαρμογή");
                }
                var result = await _app.RemoveById(id);

                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromBody]Application app)
        {
            try
            {
                if (app == null)
                {
                    return BadRequest("Σφάλμα");
                }

                if (app.IsValid())
                {
                    var result = await _app.Update(app);

                    return Ok(result);
                }
                else
                {
                    return BadRequest("Τα δεδομένα δεν είναι ορθά.");
                }
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }
       
        [HttpPost("insert")]
        public async Task<IActionResult> Insert([FromBody] Application app)
        {
            try
            {
                var result = await _app.InsertAplication(app);
                return Ok(result);
            }
            catch
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }

        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _app.GetllAll() ;
                return Ok(result);
            }
            catch
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }

        }

        [HttpGet("user-apps/{id}")]
        public async Task<IActionResult> GetUserApps( string id ) {
            try {
                var allApps  = await _app.GetllAll();
                var userApps = _usr.GetUserApps( id );
                return Ok(allApps);
            }
            catch {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }


    }
}
