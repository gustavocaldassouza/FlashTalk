using System;
using FlashTalk.Application.UseCases.MessageReceiving;
using FlashTalk.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.MessageReceiving
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class MessageReceivingController : ControllerBase, IOutputPort
  {
    private readonly IMessageReceiving _messageReceiving;
    private IActionResult? _viewModel;

    public MessageReceivingController(IMessageReceiving messageReceiving)
    {
      _messageReceiving = messageReceiving;
      _messageReceiving.SetOutputPort(this);
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(IEnumerable<Chat> chats)
    {
      _viewModel = Ok(chats);
    }

    [HttpGet]
    public IActionResult Get()
    {
      var userId = int.Parse(User.Claims.First().Value);
      _messageReceiving.Execute(userId);
      return _viewModel!;
    }
  }
}
