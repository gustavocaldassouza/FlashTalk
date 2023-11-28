using System;

namespace FlashTalk.Application.UseCases.UserSearch
{
  public interface IUserSearch
  {
    void Execute(string name);
    void SetOutputPort(IOutputPort outputPort);
  }
}
