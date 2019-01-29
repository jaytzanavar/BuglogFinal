using System;

namespace BugLogThalis.Models
{
    public class Application : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }    

    }
}
