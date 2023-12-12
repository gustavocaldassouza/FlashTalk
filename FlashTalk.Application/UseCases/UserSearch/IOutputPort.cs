using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserSearch
{
  public interface IOutputPort
  {
    void Error(string message);
    void Ok(IEnumerable<User> users);
  }
}
