using System;
using FlashTalk.Application.UseCases.MessageSending;
using FlashTalk.Domain;
using FlashTalk.Presentation.ViewModels;
using FlashTalk.Presentation.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FlashTalk.Presentation.UseCases.MessageSending
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class MessageSendingController : ControllerBase, IOutputPort
  {
    private readonly IMessageSending _messageSending;
    private readonly IHubContext<ChatHub> _hubContext;
    private IActionResult? _viewModel;
    private Chat? _sentChat;
    
    public MessageSendingController(IMessageSending messageSending, IHubContext<ChatHub> hubContext)
    {
      _messageSending = messageSending;
      _hubContext = hubContext;
      _messageSending.SetOutputPort(this);
    }

    void IOutputPort.Error(string message)
    {
      _viewModel = BadRequest(message);
    }

    void IOutputPort.Ok(Chat chat)
    {
      _viewModel = Ok(chat);
      _sentChat = chat;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] MessageSendingModel messageSendingModel)
    {
      var senderId = int.Parse(User.Claims.First().Value);
      _messageSending.Execute(senderId!,
                              messageSendingModel.ReceiverId!,
                              messageSendingModel.Message!);
      
      // Also notify via SignalR for real-time delivery
      if (_sentChat != null && _sentChat.Id > 0)
      {
        var lastMessage = _sentChat.Messages.LastOrDefault();
        if (lastMessage != null)
        {
          await _hubContext.Clients.Group($"Chat_{_sentChat.Id}").SendAsync("ReceiveMessage", new
          {
            ChatId = _sentChat.Id,
            MessageId = lastMessage.Id,
            SenderId = senderId,
            SenderName = lastMessage.Sender.Name,
            Message = messageSendingModel.Message,
            Timestamp = lastMessage.CreatedAt,
            Documents = lastMessage.Documents ?? new List<Document>()
          });
        }
      }
      
      return _viewModel!;
    }

    [HttpPost]
    [Route("file")]
    public async Task<IActionResult> Post([FromForm] FileUpload fileUpload)
    {
      var senderId = int.Parse(User.Claims.First().Value);

      var directoryPath = "./files/";
      Directory.CreateDirectory(directoryPath);
      List<string> filePaths = new List<string>();

      foreach (var file in fileUpload.Files!)
      {
        var filePath = Path.Combine(directoryPath, file.FileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
          file.CopyTo(stream);
        }

        var fullPath = Path.GetFullPath(filePath);
        filePaths.Add(fullPath);
      }

      _messageSending.Execute(senderId!,
                              fileUpload.ReceiverId!,
                              fileUpload.Message!,
                              filePaths);
      
      // Also notify via SignalR for real-time delivery
      if (_sentChat != null && _sentChat.Id > 0)
      {
        var lastMessage = _sentChat.Messages.LastOrDefault();
        if (lastMessage != null)
        {
          await _hubContext.Clients.Group($"Chat_{_sentChat.Id}").SendAsync("ReceiveMessage", new
          {
            ChatId = _sentChat.Id,
            MessageId = lastMessage.Id,
            SenderId = senderId,
            SenderName = lastMessage.Sender.Name,
            Message = fileUpload.Message,
            Timestamp = lastMessage.CreatedAt,
            Documents = lastMessage.Documents ?? new List<Document>()
          });
        }
      }
      
      return _viewModel!;
    }
  }

}
