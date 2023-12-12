using System;

namespace FlashTalk.Domain
{
  public class User
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Color { get; set; }

    public User(string name, string email, string password, string color)
    {
      Name = name;
      Email = email;
      Password = password;
      Color = color;
    }

    public User(int id, string name, string email, string password, string color)
    {
      Id = id;
      Name = name;
      Email = email;
      Password = password;
      Color = color;
    }

    public User()
    {
      Name = string.Empty;
      Email = string.Empty;
      Password = string.Empty;
      Color = string.Empty;
    }
  }
}
