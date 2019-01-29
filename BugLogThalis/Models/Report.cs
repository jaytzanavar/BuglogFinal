using BugLogThalis.Models.Views;
using System;

namespace BugLogThalis.Models
{
    public class Report : Entity
    {
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Notes { get; set; }
        public string Url { get; set; }
        public DateTime SubmitDate { get; set; }
        public DateTime Updated { get; set; }
        public bool IsRead { get; set; }
        public DateTime? Completed { get; set; }
        public ReportType ReportType { get; set; }
        public Priority Priority { get; set; }
        public string ImageId { get; set; }
        public string ApplicationId { get; set; }
        public string OnwerId { get; set; }
        public virtual UserView Onwer { get; set; }

    }

    public enum ReportType
    {
        Bug,
        Feature,
        Change,
        Support,
        All
    }

    public enum Priority
    {
        Low,
        Normal,
        High,
        Urgent,
        All
    }
}
