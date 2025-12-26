using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageDeleting
{
    public interface IMessageDeleting
    {
        void Execute(int messageId, int userId);
        void SetOutputPort(IOutputPort outputPort);
    }
}
