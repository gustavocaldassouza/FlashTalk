using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageSending
{
    public interface IMessageSending
    {
        void Execute(int senderId, int receiverId, string message);
        void SetOutputPort(IOutputPort outputPort);
    }
}
