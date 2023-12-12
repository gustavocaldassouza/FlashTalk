using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserSearch
{
  public class UserSearch : IUserSearch
  {
    private readonly IUserRepository _userRepository;
    private IOutputPort _outputPort;
    public UserSearch(IUserRepository userRepository)
    {
      _userRepository = userRepository;
      _outputPort = new UserSearchPresenter();
    }
    public void Execute(string name, int userId)
    {
      try
      {
        var users = _userRepository.GetUsersByName(name, userId);
        _outputPort.Ok(users);
      }
      catch (Exception e)
      {
        _outputPort.Error(e.Message);
      }
    }

    public void SetOutputPort(IOutputPort outputPort)
    {
      _outputPort = outputPort;
    }
  }
}
