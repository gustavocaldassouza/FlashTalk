using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageEditing
{
    public interface IMessageEditing
    {
        void Execute(int messageId, string newText, int userId);
        void SetOutputPort(IOutputPort outputPort);
    }
}
