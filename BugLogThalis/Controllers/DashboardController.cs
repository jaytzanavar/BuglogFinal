using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BugLogThalis.Services;

namespace BugLogThalis.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
    public class DashboardController : ControllerBase {

		public IUserService _userService;
		public IApplicationService _appService;
        public IReportService _reportService;

		public DashboardController(
            IUserService userService,
            IApplicationService appService,
            IReportService reportService
        ){
			_userService = userService;
			_appService = appService;
            _reportService = reportService;
		}

		[HttpGet]
        public IActionResult GetDashboard(){
            try {
				return Ok(new {
					usersCount = _userService.GetUsersCount(),
                    activeUsersCount = _userService.GetActiveUsersCount(),
					appsCount = _appService.GetApplicationsCount(),
                    reportsCount = _reportService.GetReportsCount(),
                    solvedReportsCount = _reportService.GetSolvedReportsCount()
                } );
            }
            catch (Exception){
                return BadRequest("Σφάλμα εφαρμογής");
            }
        }

    }
}