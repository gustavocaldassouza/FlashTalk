using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageReading
{
  public class MessageReadingPresenter : IOutputPort
  {
    public Chat? Chat { get; private set; }
    public bool ErrorOutput { get; private set; }
    public string? ErrorMessage { get; private set; }
    public void Error(string message)
    {
      ErrorOutput = true;
      ErrorMessage = message;
    }

    public void Ok(Chat chat)
    {
      Chat = chat;
    }
  }
}
