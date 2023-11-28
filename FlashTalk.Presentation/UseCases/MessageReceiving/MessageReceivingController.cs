using System;
using FlashTalk.Application.UseCases.MessageReceiving;
using FlashTalk.Domain;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.MessageReceiving
{
  [Route("api/[controller]")]
  [ApiController]
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

    [HttpGet("{userId}")]
    public IActionResult Get(int userId)
    {
      _messageReceiving.Execute(userId);
      return _viewModel!;
    }
  }
}
