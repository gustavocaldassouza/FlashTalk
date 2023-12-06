using System;

namespace FlashTalk.Domain
{
  public interface IUserRepository
  {
    IEnumerable<User> GetUsersByName(string name, int userId);

    User Register(string name, string email, string password);

    User GetUserInfo(int userId);

    User? GetUserByEmail(string email);

    bool IsEmailTaken(string email);
  }
}
