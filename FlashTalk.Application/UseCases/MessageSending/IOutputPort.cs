using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageSending
{
  public interface IOutputPort
  {
    void Ok(Chat chat);
    void Error(string message);
  }
}
