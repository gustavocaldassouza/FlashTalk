using System;

namespace FlashTalk.Domain
{
    public interface IUserRepository
    {
        User Register(string name, string email, string password);
    }
}
