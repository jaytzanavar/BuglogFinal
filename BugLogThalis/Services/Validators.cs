using BugLogThalis.Models;
using System;
using System.Linq;
using System.Security.Claims;

namespace BugLogThalis.Services
{
    public static class Validators
    {
        public static bool IsValid(this Report rep)
        {
            return !string.IsNullOrEmpty(rep.Title) && !string.IsNullOrEmpty(rep.Summary) && !string.IsNullOrEmpty(rep.ApplicationId) 
                && !string.IsNullOrEmpty(rep.OnwerId);
        }
        public static bool IsValid(this Application app)
        {
            return !string.IsNullOrEmpty(app.Name);
        }

        public static bool IsValid(this User u)
        {
            return !string.IsNullOrEmpty(u.Name) && !string.IsNullOrEmpty(u.Lastname) && !string.IsNullOrEmpty(u.Password) &&
                !string.IsNullOrEmpty(u.Username);
        }

        public static bool IsValidUpdate(this User u)
        {
            return !string.IsNullOrEmpty(u.Name) && !string.IsNullOrEmpty(u.Lastname) &&
                !string.IsNullOrEmpty(u.Username);
        }

        public static string GetUserId(this ClaimsPrincipal user)
        {

            var isValid = user.HasClaim(x => x.Type == "Id");
            if (isValid)
            {
                return user.Claims.First(x => x.Type == "Id").Value;
            }
            else
            {
                throw new Exception("User account is not valid");
            }
        }

        public static bool IsAdmin(this ClaimsPrincipal user)
        {
            var isValid = user.HasClaim(x => x.Type == "Role");
            if (isValid)
            {
                return user.Claims.First(x => x.Type == "Role").Value == "Admin";
            }
            else
            {
                throw new Exception("User account is not valid");
            }
        }
    }
}
