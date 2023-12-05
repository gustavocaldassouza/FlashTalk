using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserAuthentication
{
  public class UserAuthentication : IUserAuthentication
  {
    private readonly IUserRepository _userRepository;
    private IOutputPort _outputPort;
    public UserAuthentication(IUserRepository userRepository)
    {
      _outputPort = new UserAuthenticationPresenter();
      _userRepository = userRepository;
    }
    public void Execute(string email, string password)
    {
      try
      {
        var user = _userRepository.Authenticate(email, password);

        if (user == null)
        {
          _outputPort.Error("User not found");
          return;
        }

        _outputPort.Ok(user);
      }
      catch (Exception ex)
      {
        _outputPort.Error(ex.Message);
      }
    }

    public void SetOutputPort(IOutputPort outputPort)
    {
      _outputPort = outputPort;
    }
  }
}
