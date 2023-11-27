using System;

namespace FlashTalk.Domain
{
    public class Chat
    {
        public int Id { get; set; }
        public User Sender { get; set; }
        public User Receiver { get; set; }
        public string Message { get; set; }

        public Chat(User sender, User receiver, string message)
        {
            Sender = sender;
            Receiver = receiver;
            Message = message;
        }

        public Chat(int id, User sender, User receiver, string message)
        {
            Id = id;
            Sender = sender;
            Receiver = receiver;
            Message = message;
        }

        public Chat()
        {
            Sender = new User();
            Receiver = new User();
            Message = string.Empty;
        }
    }
}
