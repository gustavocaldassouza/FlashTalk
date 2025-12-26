import * as signalR from '@microsoft/signalr';

export interface ChatMessage {
    chatId: number;
    message: string;
    senderId: number;
    senderName: string;
    timestamp: Date;
}

export interface UserOnlineStatus {
    userId: number;
    userName: string;
}

export interface TypingUser {
    chatId: number;
    userId: number;
    userName: string;
}

export interface ChatParticipant {
    userId: number;
    userName: string;
}

type EventCallback = (...args: unknown[]) => void;

export class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private baseUrl: string;
    private token: string;
    private eventHandlers: Map<string, EventCallback[]> = new Map();

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    public async connect(): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            console.log('Already connected to SignalR');
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/chathub`, {
                accessTokenFactory: () => this.token,
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    // Exponential backoff: 0, 2, 10, 30 seconds, then 30 seconds thereafter
                    if (retryContext.previousRetryCount === 0) return 0;
                    if (retryContext.previousRetryCount === 1) return 2000;
                    if (retryContext.previousRetryCount === 2) return 10000;
                    return 30000;
                }
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Setup reconnection handlers
        this.connection.onreconnecting((error) => {
            console.warn('SignalR connection lost. Reconnecting...', error);
        });

        this.connection.onreconnected((connectionId) => {
            console.log('SignalR reconnected. Connection ID:', connectionId);
            // Re-register event handlers after reconnection
            this.registerPendingHandlers();
        });

        this.connection.onclose((error) => {
            console.error('SignalR connection closed:', error);
        });

        // Register all pending event handlers before connecting
        this.registerPendingHandlers();

        try {
            await this.connection.start();
            console.log('SignalR connected successfully');
        } catch (error) {
            console.error('Error connecting to SignalR:', error);
            throw error;
        }
    }

    private registerPendingHandlers(): void {
        if (!this.connection) return;

        this.eventHandlers.forEach((callbacks, eventName) => {
            callbacks.forEach(callback => {
                this.connection!.on(eventName, callback);
            });
        });

        console.log(`Registered ${this.eventHandlers.size} event types with handlers`);
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('SignalR disconnected');
            } catch (error) {
                console.error('Error disconnecting from SignalR:', error);
            }
        }
    }

    public async joinChat(chatId: number): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR connection not established');
        }

        try {
            await this.connection.invoke('JoinChat', chatId);
            console.log(`Joined chat ${chatId}`);
        } catch (error) {
            console.error(`Error joining chat ${chatId}:`, error);
            throw error;
        }
    }

    public async leaveChat(chatId: number): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR connection not established');
        }

        try {
            await this.connection.invoke('LeaveChat', chatId);
            console.log(`Left chat ${chatId}`);
        } catch (error) {
            console.error(`Error leaving chat ${chatId}:`, error);
            throw error;
        }
    }

    public async sendMessage(chatId: number, message: string, senderId: number, senderName: string): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR connection not established');
        }

        try {
            await this.connection.invoke('SendMessage', chatId, message, senderId, senderName);
            console.log(`Message sent to chat ${chatId}`);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    public async startTyping(chatId: number, userId: number, userName: string): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }

        try {
            await this.connection.invoke('StartTyping', chatId, userId, userName);
        } catch (error) {
            console.error('Error sending typing notification:', error);
        }
    }

    public async stopTyping(chatId: number, userId: number, userName: string): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }

        try {
            await this.connection.invoke('StopTyping', chatId, userId, userName);
        } catch (error) {
            console.error('Error sending stop typing notification:', error);
        }
    }

    public async getOnlineUsers(): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR connection not established');
        }

        try {
            await this.connection.invoke('GetOnlineUsers');
        } catch (error) {
            console.error('Error getting online users:', error);
            throw error;
        }
    }

    public async getChatParticipants(chatId: number): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR connection not established');
        }

        try {
            await this.connection.invoke('GetChatParticipants', chatId);
        } catch (error) {
            console.error('Error getting chat participants:', error);
            throw error;
        }
    }

    // Event listeners - Store handlers to be registered before connection
    public onMessageReceived(callback: (message: ChatMessage) => void): void {
        this.addEventHandler('ReceiveMessage', callback as EventCallback);
    }

    public onUserOnline(callback: (user: UserOnlineStatus) => void): void {
        this.addEventHandler('UserOnline', callback as EventCallback);
    }

    public onUserOffline(callback: (user: UserOnlineStatus) => void): void {
        this.addEventHandler('UserOffline', callback as EventCallback);
    }

    public onUserStartedTyping(callback: (typingUser: TypingUser) => void): void {
        this.addEventHandler('UserStartedTyping', callback as EventCallback);
    }

    public onUserStoppedTyping(callback: (typingUser: TypingUser) => void): void {
        this.addEventHandler('UserStoppedTyping', callback as EventCallback);
    }

    public onOnlineUsers(callback: (users: UserOnlineStatus[]) => void): void {
        this.addEventHandler('OnlineUsers', callback as EventCallback);
    }

    public onChatParticipants(callback: (data: { chatId: number; participants: ChatParticipant[] }) => void): void {
        this.addEventHandler('ChatParticipants', callback as EventCallback);
    }

    private addEventHandler(eventName: string, callback: EventCallback): void {
        // If connection already exists and is connected, register immediately
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            this.connection.on(eventName, callback);
            console.log(`Registered event handler for ${eventName} on active connection`);
        }

        // Store for registration during connect
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        this.eventHandlers.get(eventName)!.push(callback);
        console.log(`Stored event handler for ${eventName}`);
    }

    public getConnectionState(): signalR.HubConnectionState {
        return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
    }

    public isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }
}

