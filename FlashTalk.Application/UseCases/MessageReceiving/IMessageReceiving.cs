using System;

namespace FlashTalk.Application.UseCases.MessageReceiving
{
  public interface IMessageReceiving
  {
    void Execute(int userId);
    void SetOutputPort(IOutputPort outputPort);
  }
}
