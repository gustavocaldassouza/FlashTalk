using System;
using System.Security.Claims;
using FlashTalk.Application.UseCases.MessageDeleting;
using FlashTalk.Domain;
using FlashTalk.Presentation.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FlashTalk.Presentation.UseCases.MessageDeleting
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageDeletingController : ControllerBase, IOutputPort
    {
        private readonly IMessageDeleting _messageDeleting;
        private readonly IHubContext<ChatHub> _hubContext;
        private IActionResult? _viewModel;

        public MessageDeletingController(IMessageDeleting messageDeleting, IHubContext<ChatHub> hubContext)
        {
            _messageDeleting = messageDeleting;
            _hubContext = hubContext;
            _messageDeleting.SetOutputPort(this);
        }

        void IOutputPort.Error(string message)
        {
            _viewModel = BadRequest(new { error = message });
        }

        void IOutputPort.Ok(Message message)
        {
            _viewModel = Ok(message);
        }

        [HttpDelete("{messageId}")]
        public async Task<IActionResult> Delete(int messageId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            _messageDeleting.Execute(messageId, userId);

            if (_viewModel is OkObjectResult okResult && okResult.Value is Message deletedMessage)
            {
                // Broadcast the deleted message to all participants via SignalR
                var messageData = new
                {
                    messageId = deletedMessage.Id,
                    isDeleted = deletedMessage.IsDeleted,
                    senderId = deletedMessage.Sender.Id,
                    senderName = deletedMessage.Sender.Name
                };

                // Broadcast to all groups (clients will filter by chatId)
                await _hubContext.Clients.All.SendAsync("MessageDeleted", messageData);
            }

            return _viewModel!;
        }
    }
}
