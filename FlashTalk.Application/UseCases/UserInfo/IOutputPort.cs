using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserInfo
{
  public interface IOutputPort
  {
    void Ok(User user);
    void Error(string message);
  }
}
