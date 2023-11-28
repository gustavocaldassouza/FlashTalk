using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageReceiving
{
    public class MessageReceivingPresenter : IOutputPort
    {
        public IEnumerable<Chat>? Chats { get; private set; }
        public bool ErrorOutput { get; private set; }
        public string? ErrorMessage { get; private set; }
        public void Error(string message)
        {
            ErrorOutput = true;
            ErrorMessage = message;
        }

        public void Ok(IEnumerable<Chat> chats)
        {
            Chats = chats;
        }

    }
}
