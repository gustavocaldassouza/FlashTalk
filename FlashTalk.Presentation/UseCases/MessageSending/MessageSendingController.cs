using System;
using System.Security.Claims;
using FlashTalk.Application.UseCases.MessageSending;
using FlashTalk.Domain;
using FlashTalk.Presentation.Hubs;
using FlashTalk.Presentation.ViewModels;
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
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] MessageSendingModel messageSendingModel)
    {
      var senderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
      var senderName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown User";
      
      _messageSending.Execute(senderId!,
                              messageSendingModel.ReceiverId!,
                              messageSendingModel.Message!);
      
      if (_viewModel is OkObjectResult okResult && okResult.Value is Chat chat)
      {
        // Broadcast the message to all participants in the chat via SignalR
        var messageData = new
        {
          chatId = chat.Id,
          message = messageSendingModel.Message,
          senderId = senderId,
          senderName = senderName,
          timestamp = DateTime.UtcNow
        };
        await _hubContext.Clients.Group($"Chat_{chat.Id}").SendAsync("ReceiveMessage", messageData);
      }
      
      return _viewModel!;
    }

    [HttpPost]
    [Route("file")]
    public async Task<IActionResult> Post([FromForm] FileUpload fileUpload)
    {
      var senderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
      var senderName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown User";

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
      
      if (_viewModel is OkObjectResult okResult && okResult.Value is Chat chat)
      {
        // Broadcast the message with files to all participants in the chat via SignalR
        var fileCount = fileUpload.Files != null ? fileUpload.Files.Count() : 0;
        var messageData = new
        {
          chatId = chat.Id,
          message = fileUpload.Message,
          senderId = senderId,
          senderName = senderName,
          timestamp = DateTime.UtcNow,
          hasFiles = true,
          fileCount = fileCount
        };
        await _hubContext.Clients.Group($"Chat_{chat.Id}").SendAsync("ReceiveMessage", messageData);
      }
      
      return _viewModel!;
    }
  }

}
