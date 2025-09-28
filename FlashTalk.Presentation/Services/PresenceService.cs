using System.Collections.Concurrent;

namespace FlashTalk.Presentation.Services
{
    public class PresenceService : IPresenceService
    {
        private static readonly ConcurrentDictionary<string, UserConnection> _connections = new();
        private static readonly ConcurrentDictionary<string, TypingInfo> _typingUsers = new();

        public Task AddUserConnectionAsync(string userId, string connectionId)
        {
            var userConnection = new UserConnection
            {
                UserId = userId,
                ConnectionId = connectionId,
                ConnectedAt = DateTime.UtcNow
            };

            _connections.TryAdd(connectionId, userConnection);
            return Task.CompletedTask;
        }

        public Task RemoveUserConnectionAsync(string connectionId)
        {
            _connections.TryRemove(connectionId, out _);
            return Task.CompletedTask;
        }

        public Task<bool> IsUserOnlineAsync(string userId)
        {
            var isOnline = _connections.Values.Any(c => c.UserId == userId);
            return Task.FromResult(isOnline);
        }

        public Task<IEnumerable<string>> GetOnlineUsersAsync()
        {
            var onlineUsers = _connections.Values.Select(c => c.UserId).Distinct();
            return Task.FromResult(onlineUsers);
        }

        public Task<IEnumerable<string>> GetUserConnectionsAsync(string userId)
        {
            var connections = _connections.Values
                .Where(c => c.UserId == userId)
                .Select(c => c.ConnectionId);
            return Task.FromResult(connections);
        }

        public Task StartTypingAsync(string userId, int chatId)
        {
            var typingKey = $"{userId}_{chatId}";
            var typingInfo = new TypingInfo
            {
                UserId = userId,
                ChatId = chatId,
                StartedAt = DateTime.UtcNow
            };

            _typingUsers.AddOrUpdate(typingKey, typingInfo, (key, existing) => typingInfo);
            return Task.CompletedTask;
        }

        public Task StopTypingAsync(string userId, int chatId)
        {
            var typingKey = $"{userId}_{chatId}";
            _typingUsers.TryRemove(typingKey, out _);
            return Task.CompletedTask;
        }

        public Task<IEnumerable<string>> GetTypingUsersAsync(int chatId)
        {
            var typingUsers = _typingUsers.Values
                .Where(t => t.ChatId == chatId && DateTime.UtcNow - t.StartedAt < TimeSpan.FromSeconds(10))
                .Select(t => t.UserId);
            return Task.FromResult(typingUsers);
        }

        public async Task CleanupExpiredTypingAsync()
        {
            var expiredKeys = _typingUsers
                .Where(kvp => DateTime.UtcNow - kvp.Value.StartedAt > TimeSpan.FromSeconds(10))
                .Select(kvp => kvp.Key)
                .ToList();

            foreach (var key in expiredKeys)
            {
                _typingUsers.TryRemove(key, out _);
            }

            await Task.CompletedTask;
        }
    }

    public class UserConnection
    {
        public string UserId { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;
        public DateTime ConnectedAt { get; set; }
    }

    public class TypingInfo
    {
        public string UserId { get; set; } = string.Empty;
        public int ChatId { get; set; }
        public DateTime StartedAt { get; set; }
    }
}