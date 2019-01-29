using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BugLogThalis.Models;
using BugLogThalis.Authorization;
using BugLogThalis.Models.Views;
using BugLogThalis.DataContext;

namespace BugLogThalis.Services
{
    public interface IUserService
    {
        Task<User> GetUserById(string id);
        
        User GetUserByUsername(string username);
        Task<User> RegisterUser(User user); 
        Task<User> CreateUser(User user);
        DataResponse<User> GetUserPagedData(int page, int pagesize, int isactive, int role, string search);
        Task<bool> RemoveById(string id);
        Task<User> Update(User user);
        string GetUserRoleName(UserRole role);
		int GetUsersCount();
        int GetActiveUsersCount();
        List<Application> GetUserApps( string id );
    }

    public class UserService : IUserService
    {
        private Context _db;

        public UserService(Context db)
        {
            _db = db;
        }

        public int GetActiveUsersCount(){
            var query = _db.User.GetQueryAll().Where(x => x.IsActive == true);
            return query.Count();
        }

        public int GetUsersCount(){
			var query = _db.User.GetQueryAll();
			return query == null ? 0 : query.Count();
		}

        public string GetUserRoleName( UserRole role ){
            return Enum.GetName( typeof(UserRole), role );
        }

        public async Task<User> GetUserById(string id)
        {
            var result = await _db.User.GetById(id);
            result.PasswordHashed = null;
            return result;
        }

        public User GetUserByUsername(string username)
        {
            var result = _db.User.GetQuery(x => x.Username == username).FirstOrDefault();
            return result;
        }

        public async Task<User> RegisterUser(User user)
        {
            user.Created = DateTime.Now;
            user.IsActive = false;
            user.Role = UserRole.User;
            user.PasswordHashed = AuthManager.HashPassword(user.Password);
            var result = await _db.User.Insert(user);
            return result;
        }

        public async Task<User> CreateUser(User user)
        {
            user.Created = DateTime.Now;
            user.PasswordHashed = AuthManager.HashPassword(user.Password);
            var result = await _db.User.Insert(user);
            return result;
        }

        public DataResponse<User> GetUserPagedData(int page, int pageSize, int activated, int role, string search)
        {
            IQueryable<User> query;
            query = _db.User.GetQueryAll();

            switch (activated)
            {
                case 1:
                    //query = _db.User.GetQuery(x => x.IsActive == true);
                    query = query.Where(x => x.IsActive ==true);
                    break;
                case 2:
                    //query = _db.User.GetQuery(x => x.IsActive == false);
                    query = query.Where(x =>x.IsActive == false);
                    break;
                default:
                    break;
            }
            switch (role)
            {
                case 0: query = query.Where(x => x.Role == UserRole.Admin); break;
                case 1: query = query.Where(x => x.Role == UserRole.Manager); break;
                case 2: query = query.Where(x => x.Role == UserRole.User); break;
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(t => t.Username.ToLowerInvariant().Contains(search.ToLowerInvariant()) || t.Name.ToLowerInvariant().Contains(search.ToLowerInvariant()) || t.Lastname.ToLowerInvariant().Contains(search.ToLowerInvariant()));               
            }

            var rows = query.Count();
            var reports = query.Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToList();
            return new DataResponse<User> { TotalRows = rows, Rows = reports };
        }
        public async Task<bool> RemoveById(string id)
        {
            var actionResult = await _db.User.Delete(id);
            return actionResult;
        }
        public async Task<User> Update(User user)
        {
            var original =await _db.User.GetById(user.Id);
            original.PasswordHashed = string.IsNullOrEmpty(user.Password) ? original.PasswordHashed : AuthManager.HashPassword(user.Password);
            original.Name = user.Name;
            original.Lastname = user.Lastname;
            original.IsActive = user.IsActive;
            original.Role = user.Role;
            original.Username = user.Username;
            var result = await _db.User.Update(original);
            return result;
        }

        public List<Application> GetUserApps( string id ) {
            var user = this.GetUserById( id );
            var apps = user.Result.Apps;
            return apps;
        }

    }
}
