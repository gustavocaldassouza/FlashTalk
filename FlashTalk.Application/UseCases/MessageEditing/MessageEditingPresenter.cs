using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageEditing
{
    public class MessageEditingPresenter : IOutputPort
    {
        public Message? Message { get; private set; }
        public bool ErrorOutput { get; private set; }
        public string? ErrorMessage { get; private set; }

        void IOutputPort.Error(string message)
        {
            ErrorOutput = true;
            ErrorMessage = message;
        }

        void IOutputPort.Ok(Message message)
        {
            Message = message;
        }
    }
}
