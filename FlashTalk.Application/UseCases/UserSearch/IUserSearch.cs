using System;

namespace FlashTalk.Application.UseCases.UserSearch
{
  public interface IUserSearch
  {
    void Execute(string name, int userId);
    void SetOutputPort(IOutputPort outputPort);
  }
}
