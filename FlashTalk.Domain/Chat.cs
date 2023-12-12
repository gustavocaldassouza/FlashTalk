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
    public IEnumerable<User> Participants { get; set; }

    public Chat(int id, string name, DateTime createdAt, User owner, IEnumerable<Message> messages, IEnumerable<User> participants)
    {
      Id = id;
      Name = name;
      CreatedAt = createdAt;
      Owner = owner;
      Messages = messages;
      Participants = participants;
    }

    public Chat(string name, DateTime createdAt, User owner, IEnumerable<Message> messages, IEnumerable<User> participants)
    {
      Name = name;
      CreatedAt = createdAt;
      Owner = owner;
      Messages = messages;
      Participants = participants;
    }

    public Chat()
    {
      Name = string.Empty;
      Owner = new User();
      Messages = new List<Message>();
      Participants = new List<User>();
    }
  }
}
