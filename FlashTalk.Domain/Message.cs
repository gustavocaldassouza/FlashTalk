using System;

namespace FlashTalk.Domain
{
  public class Message
  {
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Text { get; set; }
    public User Sender { get; set; }

    public Message(int id, DateTime createdAt, string text, User sender)
    {
      Id = id;
      CreatedAt = createdAt;
      Text = text;
      Sender = sender;
    }

    public Message(DateTime createdAt, string text, User sender)
    {
      CreatedAt = createdAt;
      Text = text;
      Sender = sender;
    }

    public Message()
    {
      Text = string.Empty;
      Sender = new User();
    }
  }
}
