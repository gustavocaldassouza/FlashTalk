using System;
using FlashTalk.Application.UseCases.UserRegistration;
using FlashTalk.Domain;
using FlashTalk.Presentation.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.UserRegistration
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserRegistrationController : ControllerBase, IOutputPort
  {
    private readonly IUserRegistration _userRegistration;
    private IActionResult? _viewModel;
    public UserRegistrationController(IUserRegistration userRegistration)
    {
      _userRegistration = userRegistration;
      _userRegistration.SetOutputPort(this);
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(User user)
    {
      _viewModel = Ok(user);
    }


    [HttpPost]
    public IActionResult Post([FromBody] UserModel userModel)
    {
      _userRegistration.Execute(userModel.Name!, userModel.Email!, userModel.Password!);
      return _viewModel!;
    }
  }
}
