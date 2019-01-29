namespace BugLogThalis.Models.Views
{
    public class UserView
    {
        public string Username { get; set; }
        public string Fullname { get; set; }
        public UserRole Roleid { get; set; }

        public UserView() { }

        public UserView(User user) {
            Username = user.Username;
            Fullname = string.Join(" ", new string[] { user.Lastname, user.Name });
            Roleid = user.Role;
        }
    }
}
