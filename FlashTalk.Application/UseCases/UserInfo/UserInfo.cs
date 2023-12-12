using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserInfo
{
  public class UserInfo : IUserInfo
  {
    public IOutputPort OutputPort { get; private set; }
    private readonly IUserRepository _userRepository;
    public UserInfo(IUserRepository userRepository)
    {
      _userRepository = userRepository;
      OutputPort = new UserInfoPresenter();
    }
    public void Execute(int userId)
    {
      try
      {
        var user = _userRepository.GetUserInfo(userId);
        OutputPort.Ok(user);
      }
      catch (Exception e)
      {
        OutputPort.Error(e.Message);
      }
    }

    public void SetOutputPort(IOutputPort outputPort)
    {
      OutputPort = outputPort;
    }
  }
}
