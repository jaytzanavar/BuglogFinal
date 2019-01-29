using BugLogThalis.DataContext;
using BugLogThalis.Models;
using BugLogThalis.Models.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BugLogThalis.Services
{
    public interface IReportService
    {
        Task<Report> Insert(Report rep);
        Task<Report> Update(Report rep);
        Task<Report> GetById(string id);
        List<Report> GetAllAdmin();
        DataResponse<Report> GetPagedData(int page, int pageSize, int priority, int type, string userId, string order = "",
                                            string search = "", bool isAdmin = false);
        Task<bool> Delete(string id);
        int GetReportsCount();
        int GetSolvedReportsCount();
    }

    public class ReportService : IReportService
    {
        private Context _db;

        public ReportService(Context db, IUserService userService)
        {
            _db = db;
        }

        public int GetReportsCount(){
            return _db.Report.GetQueryAll().Count();
        }

        public int GetSolvedReportsCount(){
            return _db.Report.GetQueryAll().Where(x => x.Completed != null).Count();
        }

        public async Task<bool> Delete(string id)
        {
            var result = await _db.Report.Delete(id);
            return result;
        }

        public List<Report> GetAllAdmin()
        {
            throw new NotImplementedException();
        }

        public async Task<Report> GetById(string id)
        {
            var result = await _db.Report.GetById(id);
            return result;
        }

        public async Task<Report> Insert(Report rep)
        {
            rep.IsRead = false;
            rep.SubmitDate = DateTime.Now;
            rep.Updated = DateTime.Now;
            var result = await _db.Report.Insert(rep);
            return result;
        }

        public async Task<Report> Update(Report rep)
        {
            var result = await _db.Report.Update(rep);
            return result;
        }

        public DataResponse<Report> GetPagedData(
            int page, int pageSize, int priority, int type, string userId,
            string order = "", string search = "", bool isAdmin = false){

            IQueryable<Report> query;
            if ( isAdmin ){
                query = (from rep in _db.Report.GetQuery(x => true)
                         join user in _db.User.GetQueryAll() on rep.OnwerId equals user.Id into user
                         where (true)
                         select new Report
                         {
                             Id = rep.Id,
                             ApplicationId = rep.ApplicationId,
                             Completed = rep.Completed,
                             IsRead = rep.IsRead,
                             Notes = rep.Notes,
                             ImageId = rep.ImageId,
                             Priority = rep.Priority,
                             ReportType = rep.ReportType,
                             SubmitDate = rep.SubmitDate,
                             Summary = rep.Summary,
                             Title = rep.Title,
                             Url = rep.Url,
                             Updated = rep.Updated
                             
                         });
            } else {
                query = (from rep in _db.Report.GetQuery(x => x.OnwerId == userId)
                         join user in _db.User.GetQueryAll() on rep.OnwerId equals user.Id into user
                         where (true)
                         select new Report
                         {
                             Id = rep.Id,
                             ApplicationId = rep.ApplicationId,
                             Completed = rep.Completed,
                             IsRead = rep.IsRead,
                             Notes = rep.Notes,
                             ImageId = rep.ImageId,
                             Priority = rep.Priority,
                             ReportType = rep.ReportType,
                             SubmitDate = rep.SubmitDate,
                             Summary = rep.Summary,
                             Title = rep.Title,
                             Url = rep.Url,
                             Updated = rep.Updated,
                             Onwer = new UserView(user.First())
                         });
            }

            switch (priority)
            {
                case 0:
                    query = query.Where(s => s.Priority == Priority.Low);
                    break;
                case 1:
                    query = query.Where(s => s.Priority == Priority.Normal);
                    break;
                case 2:
                    query = query.Where(s => s.Priority == Priority.High);
                    break;
                case 3:
                    query = query.Where(s => s.Priority == Priority.Urgent);
                    break;
                default:
                    break;
            }

            switch (type)
            {
                case 0:
                    query = query.Where(s => s.ReportType == ReportType.Bug);
                    break;
                case 1:
                    query = query.Where(s => s.ReportType == ReportType.Feature);
                    break;
                case 2:
                    query = query.Where(s => s.ReportType == ReportType.Change);
                    break;
                case 3:
                    query = query.Where(s => s.ReportType == ReportType.Support);
                    break;
                case 4:
                    break;
                default:
                    break;
            }

            switch (order)
            {
                case "priority":
                    query = query.OrderBy(s => s.Priority).ThenByDescending(x => x.SubmitDate);
                    break;
                case "priority_desc":
                    query = query.OrderByDescending(s => s.Priority).ThenByDescending(x=>x.SubmitDate);
                    break;
                case "type":
                    query = query.OrderBy(s => s.ReportType).ThenByDescending(x => x.SubmitDate);
                    break;
                case "type_desc":
                    query = query.OrderByDescending(s => s.ReportType).ThenByDescending(x => x.SubmitDate);
                    break;
                default:
                    query = query.OrderByDescending(s => s.SubmitDate);
                    break;
            }
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(t => t.Title.ToLowerInvariant().Contains(search.ToLowerInvariant()));
            }

            var rows = query.Count();

            var reports = query.Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToList();

            return new DataResponse<Report> { TotalRows = rows, Rows = reports };
        }
    }
}
