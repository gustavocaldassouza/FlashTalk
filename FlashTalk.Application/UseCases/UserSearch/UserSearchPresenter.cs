using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserSearch
{
  public class UserSearchPresenter : IOutputPort
  {
    public IEnumerable<User>? users { get; private set; }
    public bool ErrorOutput { get; private set; }
    public string? ErrorMessage { get; private set; }
    public void Error(string message)
    {
      ErrorOutput = true;
      ErrorMessage = message;
    }

    public void Ok(IEnumerable<User> users)
    {
      this.users = users;
    }

  }
}
