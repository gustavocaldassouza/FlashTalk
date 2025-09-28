using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FlashTalk.Domain;
using FlashTalk.Application.UseCases.MessageSending;
using FlashTalk.Presentation.Services;

namespace FlashTalk.Presentation.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMessageSending _messageSending;
        private readonly IPresenceService _presenceService;

        public ChatHub(IMessageSending messageSending, IPresenceService presenceService)
        {
            _messageSending = messageSending;
            _presenceService = presenceService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                      ?? Context.User?.Claims.FirstOrDefault()?.Value;
            
            if (userId != null)
            {
                await _presenceService.AddUserConnectionAsync(userId, Context.ConnectionId);

                // Notify others that user is online
                await Clients.Others.SendAsync("UserOnline", userId);
                
                // Send current online users to the newly connected user
                var onlineUsers = await _presenceService.GetOnlineUsersAsync();
                await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                      ?? Context.User?.Claims.FirstOrDefault()?.Value;
                      
            if (userId != null)
            {
                await _presenceService.RemoveUserConnectionAsync(Context.ConnectionId);
                
                // Check if user has other active connections
                var isStillOnline = await _presenceService.IsUserOnlineAsync(userId);
                
                if (!isStillOnline)
                {
                    // User is completely offline
                    await Clients.Others.SendAsync("UserOffline", userId);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Send message to specific user(s) in a chat
        public async Task SendMessage(int receiverId, string message)
        {
            var senderIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? Context.User?.Claims.FirstOrDefault()?.Value;
            
            if (senderIdClaim == null || !int.TryParse(senderIdClaim, out int senderId))
            {
                await Clients.Caller.SendAsync("Error", "Unable to identify sender");
                return;
            }

            try
            {
                // Use existing message sending logic
                var messageSendingWithOutput = new MessageSendingHubAdapter(_messageSending);
                var chat = await messageSendingWithOutput.ExecuteAsync(senderId, receiverId, message);

                if (chat != null && chat.Id > 0)
                {
                    // Notify all participants in the chat group
                    var lastMessage = chat.Messages.LastOrDefault();
                    if (lastMessage != null)
                    {
                        await Clients.Group($"Chat_{chat.Id}").SendAsync("ReceiveMessage", new
                        {
                            ChatId = chat.Id,
                            MessageId = lastMessage.Id,
                            SenderId = senderId,
                            SenderName = lastMessage.Sender.Name,
                            Message = message,
                            Timestamp = lastMessage.CreatedAt,
                            Documents = lastMessage.Documents ?? new List<Document>()
                        });
                    }

                    // Stop typing indicator for sender
                    await StopTyping(chat.Id);
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", $"Failed to send message: {ex.Message}");
            }
        }

        // Join a specific chat room
        public async Task JoinChat(int chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Chat_{chatId}");
            await Clients.Group($"Chat_{chatId}").SendAsync("UserJoinedChat", 
                Context.User?.Claims.FirstOrDefault()?.Value, chatId);
        }

        // Leave a specific chat room
        public async Task LeaveChat(int chatId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Chat_{chatId}");
            await Clients.Group($"Chat_{chatId}").SendAsync("UserLeftChat", 
                Context.User?.Claims.FirstOrDefault()?.Value, chatId);
        }

        // Typing indicators
        public async Task StartTyping(int chatId)
        {
            var userId = Context.User?.Claims.FirstOrDefault()?.Value;
            if (userId != null)
            {
                await _presenceService.StartTypingAsync(userId, chatId);
                await Clients.Group($"Chat_{chatId}").SendAsync("UserStartedTyping", userId, chatId);
                
                // Auto-stop typing after 10 seconds
                _ = Task.Delay(TimeSpan.FromSeconds(10)).ContinueWith(async _ =>
                {
                    await _presenceService.StopTypingAsync(userId, chatId);
                    await Clients.Group($"Chat_{chatId}").SendAsync("UserStoppedTyping", userId, chatId);
                });
            }
        }

        public async Task StopTyping(int chatId)
        {
            var userId = Context.User?.Claims.FirstOrDefault()?.Value;
            if (userId != null)
            {
                await _presenceService.StopTypingAsync(userId, chatId);
                await Clients.Group($"Chat_{chatId}").SendAsync("UserStoppedTyping", userId, chatId);
            }
        }

        // Get online status of users
        public async Task GetOnlineUsers()
        {
            var onlineUsers = await _presenceService.GetOnlineUsersAsync();
            await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);
        }

        // Get typing users for a chat
        public async Task GetTypingUsers(int chatId)
        {
            var typingUsers = await _presenceService.GetTypingUsersAsync(chatId);
            await Clients.Caller.SendAsync("TypingUsers", typingUsers, chatId);
        }

        // Mark messages as read
        public async Task MarkMessagesAsRead(int chatId)
        {
            var userId = Context.User?.Claims.FirstOrDefault()?.Value;
            if (userId != null)
            {
                // Notify other participants that messages have been read
                await Clients.Group($"Chat_{chatId}").SendAsync("MessagesRead", userId, chatId);
            }
        }
    }


    // Adapter to integrate SignalR with existing MessageSending use case
    public class MessageSendingHubAdapter
    {
        private readonly IMessageSending _messageSending;
        private Chat? _result;
        private string? _error;

        public MessageSendingHubAdapter(IMessageSending messageSending)
        {
            _messageSending = messageSending;
        }

        public async Task<Chat?> ExecuteAsync(int senderId, int receiverId, string message)
        {
            var outputPort = new HubOutputPort();
            outputPort.OnOk = (chat) => _result = chat;
            outputPort.OnError = (error) => _error = error;

            _messageSending.SetOutputPort(outputPort);
            _messageSending.Execute(senderId, receiverId, message);

            if (_error != null)
            {
                throw new Exception(_error);
            }

            return _result;
        }
    }

    public class HubOutputPort : IOutputPort
    {
        public Action<Chat>? OnOk { get; set; }
        public Action<string>? OnError { get; set; }

        public void Ok(Chat chat)
        {
            OnOk?.Invoke(chat);
        }

        public void Error(string message)
        {
            OnError?.Invoke(message);
        }
    }
}