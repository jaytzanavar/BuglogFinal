using System.Collections.Generic;

namespace BugLogThalis.Models.Views
{
    public class DataResponse<T>
    {
        public int TotalRows { get; set; }
        public IEnumerable<T> Rows { get; set; }
    }
}
