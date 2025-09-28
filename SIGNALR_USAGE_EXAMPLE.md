# SignalR Usage Examples

## Backend Integration

The SignalR hub is automatically configured and ready to use. Here are the key integration points:

### 1. Sending Messages via HTTP API
```csharp
// When a message is sent via HTTP POST /api/MessageSending
// The controller automatically broadcasts to SignalR clients
[HttpPost]
public async Task<IActionResult> Post([FromBody] MessageSendingModel model)
{
    // ... existing logic ...
    
    // SignalR notification is sent automatically
    await _hubContext.Clients.Group($"Chat_{chatId}").SendAsync("ReceiveMessage", messageData);
}
```

### 2. SignalR Hub Methods
```csharp
// Direct SignalR message sending
await connection.InvokeAsync("SendMessage", receiverId, messageText);

// Join chat for notifications
await connection.InvokeAsync("JoinChat", chatId);

// Typing indicators
await connection.InvokeAsync("StartTyping", chatId);
await connection.InvokeAsync("StopTyping", chatId);

// Presence
await connection.InvokeAsync("GetOnlineUsers");
```

## Frontend Integration

### 1. Basic Setup
```tsx
import { SignalRProvider, useSignalRContext } from './components/SignalRProvider';

function App() {
  const token = getUserToken(); // Your JWT token
  
  return (
    <SignalRProvider 
      token={token}
      onMessageReceived={(messageData) => {
        // Handle new message
        console.log('New message:', messageData);
      }}
      onError={(error) => {
        console.error('SignalR error:', error);
      }}
    >
      <ChatApplication />
    </SignalRProvider>
  );
}
```

### 2. Using in Components
```tsx
import { useSignalRContext } from './SignalRProvider';

function ChatComponent({ chatId }: { chatId: number }) {
  const signalR = useSignalRContext();
  
  useEffect(() => {
    // Join chat for real-time updates
    signalR.joinChat(chatId);
    
    return () => {
      signalR.leaveChat(chatId);
    };
  }, [chatId]);

  const handleSendMessage = async (message: string, receiverId: number) => {
    try {
      // Send via SignalR for instant delivery
      await signalR.sendMessage(receiverId, message);
    } catch (error) {
      // Fallback to HTTP API
      await sendMessageViaHTTP(receiverId, message);
    }
  };

  const handleTyping = async (isTyping: boolean) => {
    if (isTyping) {
      await signalR.startTyping(chatId);
    } else {
      await signalR.stopTyping(chatId);
    }
  };

  return (
    <div>
      {/* Connection status */}
      <SignalRStatus />
      
      {/* Online users indicator */}
      <div>Online: {signalR.onlineUsers.length} users</div>
      
      {/* Typing indicator */}
      {signalR.typingUsers[chatId]?.length > 0 && (
        <div>
          {signalR.typingUsers[chatId].join(', ')} {
            signalR.typingUsers[chatId].length === 1 ? 'is' : 'are'
          } typing...
        </div>
      )}
      
      {/* Message input with typing detection */}
      <input
        onFocus={() => handleTyping(true)}
        onBlur={() => handleTyping(false)}
        onChange={(e) => {
          if (e.target.value.length > 0) {
            handleTyping(true);
          } else {
            handleTyping(false);
          }
        }}
      />
    </div>
  );
}
```

### 3. Advanced Usage
```tsx
function useTypingIndicator(chatId: number, debounceMs = 1000) {
  const signalR = useSignalRContext();
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      signalR.startTyping(chatId);
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to stop typing
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      signalR.stopTyping(chatId);
    }, debounceMs);
  }, [chatId, isTyping, debounceMs]);

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      signalR.stopTyping(chatId);
    }
  }, [chatId, isTyping]);

  return { startTyping, stopTyping, isTyping };
}
```

## API Endpoints

### REST Endpoints (existing functionality enhanced)
- `POST /api/MessageSending` - Send message (now with SignalR broadcast)
- `GET /api/MessageReceiving` - Get messages
- `PUT /api/MessageReading/{chatId}` - Mark as read (now with SignalR notification)

### New Presence API
- `GET /api/Presence/online` - Get online users
- `GET /api/Presence/typing/{chatId}` - Get typing users in chat
- `GET /api/Presence/status/{userId}` - Get specific user online status

### SignalR Hub Endpoint
- `ws://localhost:5000/chathub` - WebSocket connection for real-time events

## Events Reference

### Client Events (receive from server)
- `ReceiveMessage` - New message received
- `UserOnline` - User came online
- `UserOffline` - User went offline  
- `OnlineUsers` - List of online users
- `UserStartedTyping` - User started typing
- `UserStoppedTyping` - User stopped typing
- `MessagesRead` - Messages marked as read
- `UserJoinedChat` - User joined chat
- `UserLeftChat` - User left chat
- `Error` - Error occurred

### Server Methods (call from client)
- `SendMessage(receiverId, message)` - Send message
- `JoinChat(chatId)` - Join chat room
- `LeaveChat(chatId)` - Leave chat room
- `StartTyping(chatId)` - Start typing indicator
- `StopTyping(chatId)` - Stop typing indicator
- `GetOnlineUsers()` - Request online users
- `GetTypingUsers(chatId)` - Request typing users
- `MarkMessagesAsRead(chatId)` - Mark messages as read

## Authentication

SignalR connections use the same JWT authentication as the REST API:

```typescript
const connection = new HubConnectionBuilder()
  .withUrl('/chathub', {
    accessTokenFactory: () => userJwtToken
  })
  .build();
```

The token is passed via query string and validated using the same JWT middleware.