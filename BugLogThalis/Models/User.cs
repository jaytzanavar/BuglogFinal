using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace BugLogThalis.Models
{
    public class User : Entity
    {
        public string Name { get; set; }
        public string Lastname { get; set; }
        public DateTime Created { get; set; }
        public string PasswordHashed { get; set; }
        [BsonIgnore]
        public string Password { get; set; }
        public string Username { get; set; }
        public bool IsActive { get; set; }
        public UserRole Role { get; set; }
        public List<Application> Apps { get; set; }
    }

    public enum UserRole
    {
        Admin,
        Manager,
        User
    }
}
