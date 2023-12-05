using System;
using System.Security.Claims;
using FlashTalk.Domain;
using FlashTalk.Presentation.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation
{
  [ApiController]
  [Route("[controller]")]
  public class AuthenticateController : ControllerBase
  {
    private readonly IUserRepository _userRepository;
    private readonly IJwtUtils _jwtUtils;

    public AuthenticateController(IUserRepository userRepository, IJwtUtils jwtUtils)
    {
      _userRepository = userRepository;
      _jwtUtils = jwtUtils;
    }

    [HttpGet("{email}")]
    public IActionResult Authenticate(string email)
    {
      User user = _userRepository.GetUserByEmail(email);

      if (user == null)
        return NoContent();

      var token = _jwtUtils.GenerateJwtToken(user);

      return Ok(token);
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetUserInfo()
    {
      var userId = User.Claims.First().Value;

      return Ok(userId);
    }
  }
}
