using BugLogThalis.Models;
using BugLogThalis.Models.Views;
using BugLogThalis.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BugLogThalis.Authorization
{
    [Authorize]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _srv;
        private FileManager _fm;
        private IUserService _userService;

        public ReportController(IReportService srv, FileManager fm, IUserService userService)
        {
            _srv = srv;
            _fm = fm;
            _userService = userService;
        }

        [HttpPost("")]
        public async Task<IActionResult> Insert([FromBody]Report re)
        {
            try
            {
                var userId = User.GetUserId();
                if (re == null)
                {
                    return BadRequest("Σφάλμα");
                }
                re.OnwerId = userId;
                if (re.IsValid())
                {
                   
                    var result = await _srv.Insert(re);

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

        [HttpPut("")]
        public async Task<IActionResult> Update([FromBody]Report re)
        {
            try
            {
                if (re == null)
                {
                    return BadRequest("Σφάλμα");
                }

                if (re.IsValid())
                {
                    var result = await _srv.Update(re);

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var userId = User.GetUserId();
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Σφάλμα");
                }
                var original = await _srv.GetById(id);

                if (original.OnwerId != userId)
                {
                    return BadRequest("Δεν έχετε δικαίωματα διαγραφής");
                }
                var result = await _srv.Delete(id);

                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

        [HttpGet("report/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Σφάλμα");
                }

                var result = await _srv.GetById(id);

                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

        [HttpGet("reports/{page}/{pagesize}/{priority}/{type}/{order?}/{search?}")]
        public IActionResult GetPagedData(int page, int pageSize, int priority, int type, string order = "", string search = "")
        {
            try
            {
                var userId = User.GetUserId();
                var user = _userService.GetUserById(userId);
                var isAdmin = user.Result.Role == UserRole.Admin;
                DataResponse<Report> result = _srv.GetPagedData(page, pageSize, priority, type, userId, order, search, isAdmin);

                return Ok(result);
            }
            catch (Exception e)
            {
                // return BadRequest("Σφάλμα συλλογής δεδομένων!");
                return BadRequest( e.Message );
            }
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var file = await _fm.GetFile(id);

                if (file == null)
                    return NotFound("File not found");

                var result = File(file.Item2, "application/octet-stream", file.Item1);

                return result;
            }
            catch (Exception exc)
            {
                return this.BadRequest(exc.Message);
            }
        }

        [HttpPost("image/application/{id}")]
        public async Task<IActionResult> AddApplicationImage([FromRoute]string id, IFormFile file)
        {
            try
            {
                string fileid = string.Empty;
                string thumbFileid = string.Empty;
                if (file.Length > 0)
                {
                    var report = await _srv.GetById(id);
                    if (report == null)
                        return NotFound("application not found");

                    using (var stream = new MemoryStream())
                    {
                        await file.CopyToAsync(stream);
                        fileid = await _fm.UploadFile(file.FileName, stream);
                        stream.Position = 0;
                        //using (var ts = new MemoryStream())
                        //{
                        //    thumbFileid = await _fm.UploadFile("thumb_" + file.FileName, ts);
                        //}
                    }
                    report.ImageId = fileid;
                    await _srv.Update(report);

                    return Ok(fileid);
                }
                else
                {
                    return BadRequest("Empty file");
                }
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
    }
}
