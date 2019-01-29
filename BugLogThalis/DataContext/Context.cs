using BugLogThalis.Models;
using MongoDB.Driver;
using System;

namespace BugLogThalis.DataContext
{
    public class Context
    {
        public IMongoDatabase Database { get; private set; }

        public MongoDbRepository<User> User { get; set; }
        public MongoDbRepository<Application> Application { get; set; }
        public MongoDbRepository<Report> Report { get; set; }

        public Context(string connectionString)
        {
            var url = new MongoUrl(connectionString);

            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            var client = new MongoClient(settings);
            if (url.DatabaseName == null)
            {
                throw new ArgumentException("Your connection string must contain a database name", connectionString);
            }

            this.Database = client.GetDatabase(url.DatabaseName);

            User = new MongoDbRepository<User>(this.Database, "Users");
            Report = new MongoDbRepository<Report>(this.Database, "Reports");
            Application = new MongoDbRepository<Application>(this.Database, "Applications");
        }
    }
}
