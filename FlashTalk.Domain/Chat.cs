using System;

namespace FlashTalk.Domain
{
  public class Chat
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public User Owner { get; set; }
    public IEnumerable<Message> Messages { get; set; }

    public Chat(int id, string name, DateTime createdAt, User owner, IEnumerable<Message> messages)
    {
      Id = id;
      Name = name;
      CreatedAt = createdAt;
      Owner = owner;
      Messages = messages;
    }

    public Chat(string name, DateTime createdAt, User owner, IEnumerable<Message> messages)
    {
      Name = name;
      CreatedAt = createdAt;
      Owner = owner;
      Messages = messages;
    }

    public Chat()
    {
      Name = string.Empty;
      Owner = new User();
      Messages = new List<Message>();
    }
  }
}
