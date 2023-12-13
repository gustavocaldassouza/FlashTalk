using System;

namespace FlashTalk.Domain
{
  public class Message
  {
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Text { get; set; }
    public User Sender { get; set; }
    public bool IsRead { get; set; }

    public Message(int id, DateTime createdAt, string text, User sender, bool isRead)
    {
      Id = id;
      CreatedAt = createdAt;
      Text = text;
      Sender = sender;
      IsRead = isRead;
    }

    public Message(DateTime createdAt, string text, User sender, bool isRead)
    {
      CreatedAt = createdAt;
      Text = text;
      Sender = sender;
      IsRead = isRead;
    }

    public Message()
    {
      Text = string.Empty;
      Sender = new User();
      IsRead = false;
    }
  }
}
