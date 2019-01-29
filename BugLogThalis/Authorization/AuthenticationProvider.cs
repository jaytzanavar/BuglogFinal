using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using BugLogThalis.Models;
using BugLogThalis.Services;

namespace BugLogThalis.Authorization
{

    public interface IAuthenticationProvider
    {
        JwtSecurityToken CreateToken(User user);
    }

    public class AuthenticationProvider : IAuthenticationProvider
    {
        public readonly IConfiguration config;
        private IUserService userService;

        public AuthenticationProvider(IConfiguration _config, IUserService _userService){
            config = _config;
            userService = _userService;
        }

        public JwtSecurityToken CreateToken(User user)
        {
            var roleName = userService.GetUserRoleName(user.Role).ToLower();
            var claims = new List<Claim>();

            claims.Add(new Claim("Id", user.Id));
            claims.Add(new Claim("Role", roleName));
            claims.Add(new Claim("Username", user.Username));
            claims.Add(new Claim("Name", user.Name));
            claims.Add(new Claim("Lastname", user.Lastname));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Tokens:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
              config["Tokens:Issuer"],
              config["Tokens:Issuer"],
              claims,
              expires: DateTime.UtcNow.AddHours(8),
              signingCredentials: creds);

            return token;
        }

    }
}
