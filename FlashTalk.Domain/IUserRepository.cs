using System;

namespace FlashTalk.Domain
{
    public interface IUserRepository
    {
        IEnumerable<User> GetUsersByName(string name);

        User Register(string name, string email, string password);
    }
}
