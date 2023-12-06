using System;
using FlashTalk.Application.UseCases.UserInfo;
using FlashTalk.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.UserInfo
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class UserInfoController : ControllerBase, IOutputPort
  {
    private IActionResult? _viewModel;
    private readonly IUserInfo _userInfo;

    public UserInfoController(IUserInfo userInfo)
    {
      _userInfo = userInfo;
      _userInfo.SetOutputPort(this);
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(User user)
    {
      _viewModel = Ok(user);
    }

    [HttpGet]
    public IActionResult Get()
    {
      var userId = int.Parse(User.Claims.First().Value);
      _userInfo.Execute(userId);
      return _viewModel!;
    }

  }
}
