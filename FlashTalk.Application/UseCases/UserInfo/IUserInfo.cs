using System;

namespace FlashTalk.Application.UseCases.UserInfo
{
  public interface IUserInfo
  {
    void Execute(int userId);
    void SetOutputPort(IOutputPort outputPort);
  }
}
