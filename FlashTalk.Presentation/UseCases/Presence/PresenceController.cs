using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FlashTalk.Presentation.Hubs;

namespace FlashTalk.Presentation.UseCases.Presence
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PresenceController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public PresenceController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("join-chat/{chatId}")]
        public async Task<IActionResult> JoinChat(int chatId)
        {
            var userId = int.Parse(User.Claims.First().Value);
            var userName = User.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "Unknown User";

            // Notify other users in the chat about the user joining
            await _hubContext.Clients.Group($"Chat_{chatId}")
                .SendAsync("UserJoinedChat", new { userId, userName, chatId });

            return Ok(new { message = "Joined chat successfully" });
        }

        [HttpPost("leave-chat/{chatId}")]
        public async Task<IActionResult> LeaveChat(int chatId)
        {
            var userId = int.Parse(User.Claims.First().Value);
            var userName = User.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "Unknown User";

            // Notify other users in the chat about the user leaving
            await _hubContext.Clients.Group($"Chat_{chatId}")
                .SendAsync("UserLeftChat", new { userId, userName, chatId });

            return Ok(new { message = "Left chat successfully" });
        }

    [HttpPost("start-typing/{chatId}")]
    public async Task<IActionResult> StartTyping(int chatId)
    {
      var userId = int.Parse(User.Claims.First().Value);
      var userName = User.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "Unknown User";

      // Notify other users in the chat that this user is typing
      await _hubContext.Clients.Group($"Chat_{chatId}")
          .SendAsync("UserStartedTyping", new { chatId, userId, userName });

      return Ok(new { message = "Typing indicator sent" });
    }

    [HttpPost("stop-typing/{chatId}")]
    public async Task<IActionResult> StopTyping(int chatId)
    {
      var userId = int.Parse(User.Claims.First().Value);
      var userName = User.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "Unknown User";

      // Notify other users in the chat that this user stopped typing
      await _hubContext.Clients.Group($"Chat_{chatId}")
          .SendAsync("UserStoppedTyping", new { chatId, userId, userName });

      return Ok(new { message = "Stopped typing indicator sent" });
    }

        [HttpGet("online-users")]
        public IActionResult GetOnlineUsers()
        {
            // This will be handled by the SignalR hub directly
            // The client should call the hub method instead
            return Ok(new { message = "Use SignalR hub method GetOnlineUsers instead" });
        }

        [HttpGet("chat-participants/{chatId}")]
        public IActionResult GetChatParticipants(int chatId)
        {
            // This will be handled by the SignalR hub directly
            // The client should call the hub method instead
            return Ok(new { message = "Use SignalR hub method GetChatParticipants instead" });
        }
    }
}
