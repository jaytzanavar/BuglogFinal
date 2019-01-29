using BugLogThalis.DataContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BugLogThalis.Models;
using BugLogThalis.Models.Views;
using MongoDB.Driver;
namespace BugLogThalis.Services

{
    public interface IApplicationService
    {
        Task<Application> GetApplicationById(string id);
        Application GetApplicationByName(string appname);
        Task<Application> InsertAplication(Application appl);
        Task<List<Application>> GetllAll();
        Task<bool> RemoveById(string id);   
        Task<Application> Update(Application appl);
		int GetApplicationsCount();

	}
    public class ApplicationService : IApplicationService
    {
        private Context _db;
        public ApplicationService(Context db)
        {
            _db = db;
        }

        public int GetApplicationsCount(){
			var query = _db.Application.GetQueryAll();
			return query == null ? 0 : query.Count();
		}
      
        public async Task<Application> GetApplicationById(string id)
        {
            var result = await _db.Application.GetById(id);
            return result;
        }

        public  Application GetApplicationByName(string appname)
        {
            var result =  _db.Application.GetQuery(x=>x.Name == appname).FirstOrDefault();
            return result;
        }
        public async Task<Application> InsertAplication(Application appl)
        {           
            appl.Created = DateTime.Now;
            appl.Updated = DateTime.Now;
            var result = await _db.Application.Insert(appl);
            return result;                     
        }
                
        public async Task<bool> RemoveById(string id)
        {
            var actionResult = await _db.Application.Delete(id);
            return actionResult;
        }

        public async Task<Application> Update(Application appl)
        {
            var result = await _db.Application.Update(appl);
            return result;
        }

        public async Task<List<Application>> GetllAll()
        {
            var result = await _db.Application.GetAll();
            return result.ToList();
        }

    }


}
