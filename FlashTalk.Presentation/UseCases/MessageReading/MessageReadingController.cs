using System;
using FlashTalk.Application.UseCases.MessageReading;
using FlashTalk.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.MessageReading
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class MessageReadingController : ControllerBase, IOutputPort
  {
    private readonly IMessageReading _messageReading;
    public IActionResult? _viewModel { get; set; }
    public MessageReadingController(IMessageReading messageReading)
    {
      _messageReading = messageReading;
      _messageReading.SetOutputPort(this);
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(Chat chat)
    {
      _viewModel = Ok(chat);
    }

    [HttpGet("{chatId}")]
    public IActionResult Get(int chatId)
    {
      var userId = int.Parse(User.Claims.First().Value);
      _messageReading.Execute(chatId, userId);
      return _viewModel!;
    }
  }
}
