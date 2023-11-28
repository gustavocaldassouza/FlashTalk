using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageReceiving
{
  public interface IOutputPort
  {
    void Ok(IEnumerable<Chat> chats);
    void Error(string message);
  }
}
