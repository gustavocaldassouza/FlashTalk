using System;

namespace FlashTalk.Application.UseCases.MessageReading
{
  public interface IMessageReading
  {
    void Execute(int chatId, int userId);
    void SetOutputPort(IOutputPort outputPort);
  }
}
