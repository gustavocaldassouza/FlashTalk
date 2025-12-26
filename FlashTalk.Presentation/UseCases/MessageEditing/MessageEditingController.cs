using System;
using System.Security.Claims;
using FlashTalk.Application.UseCases.MessageEditing;
using FlashTalk.Domain;
using FlashTalk.Presentation.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FlashTalk.Presentation.UseCases.MessageEditing
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageEditingController : ControllerBase, IOutputPort
    {
        private readonly IMessageEditing _messageEditing;
        private readonly IHubContext<ChatHub> _hubContext;
        private IActionResult? _viewModel;

        public MessageEditingController(IMessageEditing messageEditing, IHubContext<ChatHub> hubContext)
        {
            _messageEditing = messageEditing;
            _hubContext = hubContext;
            _messageEditing.SetOutputPort(this);
        }

        void IOutputPort.Error(string message)
        {
            _viewModel = BadRequest(new { error = message });
        }

        void IOutputPort.Ok(Message message)
        {
            _viewModel = Ok(message);
        }

        [HttpPut("{messageId}")]
        public async Task<IActionResult> Put(int messageId, [FromBody] EditMessageModel editModel)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            if (string.IsNullOrEmpty(editModel.Text))
            {
                return BadRequest(new { error = "Message text cannot be empty" });
            }

            _messageEditing.Execute(messageId, editModel.Text, userId);

            if (_viewModel is OkObjectResult okResult && okResult.Value is Message editedMessage)
            {
                // Broadcast the edited message to all participants via SignalR
                var messageData = new
                {
                    messageId = editedMessage.Id,
                    text = editedMessage.Text,
                    editedAt = editedMessage.EditedAt,
                    senderId = editedMessage.Sender.Id,
                    senderName = editedMessage.Sender.Name
                };

                // Get the chat ID from message - we need to find it
                // For now, broadcast to all groups (clients will filter by chatId)
                await _hubContext.Clients.All.SendAsync("MessageEdited", messageData);
            }

            return _viewModel!;
        }
    }
}

public class EditMessageModel
{
    public string? Text { get; set; }
}
