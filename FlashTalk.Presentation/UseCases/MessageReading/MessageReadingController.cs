using System;
using FlashTalk.Application.UseCases.MessageReading;
using FlashTalk.Domain;
using FlashTalk.Presentation.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FlashTalk.Presentation.UseCases.MessageReading
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class MessageReadingController : ControllerBase, IOutputPort
  {
    private readonly IMessageReading _messageReading;
    private readonly IHubContext<ChatHub> _hubContext;
    public IActionResult? _viewModel { get; set; }
    private Chat? _readChat;
    
    public MessageReadingController(IMessageReading messageReading, IHubContext<ChatHub> hubContext)
    {
      _messageReading = messageReading;
      _hubContext = hubContext;
      _messageReading.SetOutputPort(this);
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(Chat chat)
    {
      _viewModel = Ok(chat);
      _readChat = chat;
    }

    [HttpPut("{chatId}")]
    public async Task<IActionResult> Put(int chatId)
    {
      var userId = int.Parse(User.Claims.First().Value);
      _messageReading.Execute(chatId, userId);
      
      // Notify other participants that messages have been read
      if (_readChat != null)
      {
        await _hubContext.Clients.Group($"Chat_{chatId}").SendAsync("MessagesRead", userId, chatId);
      }
      
      return _viewModel!;
    }
  }
}
