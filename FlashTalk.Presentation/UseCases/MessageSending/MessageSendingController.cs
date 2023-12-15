using System;
using FlashTalk.Application.UseCases.MessageSending;
using FlashTalk.Domain;
using FlashTalk.Presentation.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.MessageSending
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class MessageSendingController : ControllerBase, IOutputPort
  {
    private readonly IMessageSending _messageSending;
    private IActionResult? _viewModel;
    public MessageSendingController(IMessageSending messageSending)
    {
      _messageSending = messageSending;
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
    public IActionResult Post([FromBody] MessageSendingModel messageSendingModel)
    {
      var senderId = int.Parse(User.Claims.First().Value);
      _messageSending.Execute(senderId!,
                              messageSendingModel.ReceiverId!,
                              messageSendingModel.Message!,
                              string.Empty);
      return _viewModel!;
    }

    [HttpPost]
    [Route("file")]
    public IActionResult Post([FromForm] FileUpload fileUpload)
    {
      var senderId = int.Parse(User.Claims.First().Value);

      var directoryPath = "./files/";
      Directory.CreateDirectory(directoryPath);
      var filePath = Path.Combine(directoryPath, fileUpload.File!.FileName);

      using (var stream = new FileStream(filePath, FileMode.Create))
      {
        fileUpload.File.CopyTo(stream);
      }

      var fullPath = Path.GetFullPath(filePath);

      _messageSending.Execute(senderId!,
                              fileUpload.ReceiverId!,
                              fileUpload.Message!,
                              fullPath);
      return _viewModel!;
    }
  }

}
