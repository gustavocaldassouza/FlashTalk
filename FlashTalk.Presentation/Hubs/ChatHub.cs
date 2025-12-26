using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;
using FlashTalk.Domain;

namespace FlashTalk.Presentation.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, UserConnection> _connections = new();
        private static readonly ConcurrentDictionary<int, HashSet<string>> _chatGroups = new();
        private readonly IChatRepository _chatRepository;

        public ChatHub(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public class UserConnection
        {
            public int UserId { get; set; }
            public string UserName { get; set; } = string.Empty;
            public string ConnectionId { get; set; } = string.Empty;
            public DateTime LastSeen { get; set; } = DateTime.UtcNow;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            var userName = GetUserName();
            
            if (userId > 0)
            {
                var connection = new UserConnection
                {
                    UserId = userId,
                    UserName = userName,
                    ConnectionId = Context.ConnectionId,
                    LastSeen = DateTime.UtcNow
                };

                _connections.TryAdd(Context.ConnectionId, connection);

                // Notify all clients about user coming online
                await Clients.All.SendAsync("UserOnline", new { userId, userName });
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connections.TryRemove(Context.ConnectionId, out var connection))
            {
                // Notify all clients about user going offline
                await Clients.All.SendAsync("UserOffline", new { connection.UserId, connection.UserName });
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinChat(int chatId)
        {
            var userId = GetUserId();
            if (userId > 0)
            {
                var groupName = $"Chat_{chatId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                
                _chatGroups.AddOrUpdate(chatId, 
                    new HashSet<string> { Context.ConnectionId },
                    (key, existing) => 
                    {
                        existing.Add(Context.ConnectionId);
                        return existing;
                    });

                // Notify other users in the chat about the user joining
                await Clients.GroupExcept(groupName, Context.ConnectionId)
                    .SendAsync("UserJoinedChat", new { userId, chatId });
            }
        }

        public async Task LeaveChat(int chatId)
        {
            var userId = GetUserId();
            if (userId > 0)
            {
                var groupName = $"Chat_{chatId}";
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                
                if (_chatGroups.TryGetValue(chatId, out var connections))
                {
                    connections.Remove(Context.ConnectionId);
                    if (connections.Count == 0)
                    {
                        _chatGroups.TryRemove(chatId, out _);
                    }
                }

                // Notify other users in the chat about the user leaving
                await Clients.GroupExcept(groupName, Context.ConnectionId)
                    .SendAsync("UserLeftChat", new { userId, chatId });
            }
        }

        public async Task SendMessage(int chatId, string message, int senderId, string senderName)
        {
            try
            {
                // Save the message to the database
                _chatRepository.InsertNewMessage(chatId, message, senderId);

                // Broadcast the message to all participants in the chat
                var groupName = $"Chat_{chatId}";
                await Clients.Group(groupName).SendAsync("ReceiveMessage", new
                {
                    chatId,
                    message,
                    senderId,
                    senderName,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                // Handle any exceptions
                await Clients.Caller.SendAsync("MessageError", new { error = ex.Message });
            }
        }

        public async Task StartTyping(int chatId, int userId, string userName)
        {
            var groupName = $"Chat_{chatId}";
            await Clients.GroupExcept(groupName, Context.ConnectionId)
                .SendAsync("UserStartedTyping", new { chatId, userId, userName });
        }

        public async Task StopTyping(int chatId, int userId, string userName)
        {
            var groupName = $"Chat_{chatId}";
            await Clients.GroupExcept(groupName, Context.ConnectionId)
                .SendAsync("UserStoppedTyping", new { chatId, userId, userName });
        }

        public async Task GetOnlineUsers()
        {
            var onlineUsers = _connections.Values
                .Select(c => new { c.UserId, c.UserName, c.LastSeen })
                .ToList();
            
            await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);
        }

        public async Task GetChatParticipants(int chatId)
        {
            var groupName = $"Chat_{chatId}";
            var participants = _chatGroups.GetValueOrDefault(chatId, new HashSet<string>())
                .Select(connectionId => _connections.GetValueOrDefault(connectionId))
                .Where(connection => connection != null)
                .Select(connection => new { connection!.UserId, connection.UserName })
                .ToList();

            await Clients.Caller.SendAsync("ChatParticipants", new { chatId, participants });
        }

        private int GetUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        private string GetUserName()
        {
            return Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown User";
        }
    }
}
