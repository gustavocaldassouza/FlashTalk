using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageEditing
{
    public interface IOutputPort
    {
        void Ok(Message message);
        void Error(string message);
    }
}
