using System;
using FlashTalk.Application.UseCases.UserAuthentication;
using FlashTalk.Domain;
using FlashTalk.Presentation.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.UserAuthentication
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserAuthenticationController : ControllerBase, IOutputPort
  {
    private readonly IUserAuthentication _userAuthentication;
    private readonly IJwtUtils _jwtUtils;
    private IActionResult? _viewModel;

    public UserAuthenticationController(IUserAuthentication userAuthentication, IJwtUtils jwtUtils)
    {
      _userAuthentication = userAuthentication;
      _userAuthentication.SetOutputPort(this);
      _jwtUtils = jwtUtils;
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(User user)
    {
      var token = _jwtUtils.GenerateJwtToken(user);
      _viewModel = Ok(token);
    }

    [HttpPost()]
    public IActionResult Authenticate([FromBody] UserModel userModel)
    {
      _userAuthentication.Execute(userModel.Email!, userModel.Password!);
      return _viewModel!;
    }
  }
}
