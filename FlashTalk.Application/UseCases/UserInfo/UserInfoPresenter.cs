using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserInfo
{
  public class UserInfoPresenter : IOutputPort
  {
    public User? User { get; private set; }
    public bool ErrorOutput { get; private set; }
    public string? ErrorMessage { get; private set; }
    public void Error(string message)
    {
      ErrorOutput = true;
      ErrorMessage = message;
    }

    public void Ok(User user)
    {
      User = user;
    }
  }
}
