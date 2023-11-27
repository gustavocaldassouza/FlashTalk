using System;
using FlashTalk.Application.UseCases.MessageSending;
using FlashTalk.Domain;
using FlashTalk.Presentation.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.MessageSending
{
    [Route("api/[controller]")]
    [ApiController]
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
            _messageSending.Execute(messageSendingModel.SenderId!,
                                    messageSendingModel.ReceiverId!,
                                    messageSendingModel.Message!);
            return _viewModel!;
        }
    }

}
