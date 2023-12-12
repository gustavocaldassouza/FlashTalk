using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageSending
{
  public class IMessageSendingPresenter : IOutputPort
  {
    public Chat? Chat { get; private set; }
    public bool ErrorOutput { get; private set; }
    public string? ErrorMessage { get; private set; }
    void IOutputPort.Error(string message)
    {
      ErrorOutput = true;
      ErrorMessage = message;
    }

    void IOutputPort.Ok(Chat chat)
    {
      Chat = chat;
    }

  }
}
