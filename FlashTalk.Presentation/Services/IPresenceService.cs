namespace FlashTalk.Presentation.Services
{
    public interface IPresenceService
    {
        Task AddUserConnectionAsync(string userId, string connectionId);
        Task RemoveUserConnectionAsync(string connectionId);
        Task<bool> IsUserOnlineAsync(string userId);
        Task<IEnumerable<string>> GetOnlineUsersAsync();
        Task<IEnumerable<string>> GetUserConnectionsAsync(string userId);
        Task StartTypingAsync(string userId, int chatId);
        Task StopTypingAsync(string userId, int chatId);
        Task<IEnumerable<string>> GetTypingUsersAsync(int chatId);
        Task CleanupExpiredTypingAsync();
    }
}