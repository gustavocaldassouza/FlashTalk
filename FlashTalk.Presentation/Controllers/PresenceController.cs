using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FlashTalk.Presentation.Services;

namespace FlashTalk.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PresenceController : ControllerBase
    {
        private readonly IPresenceService _presenceService;

        public PresenceController(IPresenceService presenceService)
        {
            _presenceService = presenceService;
        }

        [HttpGet("online")]
        public async Task<IActionResult> GetOnlineUsers()
        {
            try
            {
                var onlineUsers = await _presenceService.GetOnlineUsersAsync();
                return Ok(new { OnlineUsers = onlineUsers });
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to get online users: {ex.Message}");
            }
        }

        [HttpGet("typing/{chatId}")]
        public async Task<IActionResult> GetTypingUsers(int chatId)
        {
            try
            {
                var typingUsers = await _presenceService.GetTypingUsersAsync(chatId);
                return Ok(new { ChatId = chatId, TypingUsers = typingUsers });
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to get typing users: {ex.Message}");
            }
        }

        [HttpGet("status/{userId}")]
        public async Task<IActionResult> GetUserStatus(string userId)
        {
            try
            {
                var isOnline = await _presenceService.IsUserOnlineAsync(userId);
                return Ok(new { UserId = userId, IsOnline = isOnline });
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to get user status: {ex.Message}");
            }
        }
    }
}