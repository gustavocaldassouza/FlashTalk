using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageDeleting
{
    public interface IOutputPort
    {
        void Ok(Message message);
        void Error(string message);
    }
}
