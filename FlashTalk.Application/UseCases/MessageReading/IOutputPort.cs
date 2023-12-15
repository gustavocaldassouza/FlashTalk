using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageReading
{
  public interface IOutputPort
  {
    void Ok(Chat chat);
    void Error(string message);
  }
}
