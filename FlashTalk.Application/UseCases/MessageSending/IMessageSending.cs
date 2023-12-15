using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageSending
{
  public interface IMessageSending
  {
    void Execute(int senderId, int receiverId, string message, string filePath);
    void SetOutputPort(IOutputPort outputPort);
  }
}
