import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export class SignalRService {
  private connection: HubConnection | null = null;
  private isConnected = false;

  constructor(private token: string) {}

  public async connect(): Promise<void> {
    if (this.connection) {
      await this.disconnect();
    }

    this.connection = new HubConnectionBuilder()
      .withUrl('/chathub', {
        accessTokenFactory: () => this.token
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Set up event handlers
    this.setupEventHandlers();

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.isConnected = false;
      console.log('SignalR Disconnected');
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Message events
    this.connection.on('ReceiveMessage', (messageData) => {
      this.onMessageReceived?.(messageData);
    });

    // Presence events
    this.connection.on('UserOnline', (userId) => {
      this.onUserOnline?.(userId);
    });

    this.connection.on('UserOffline', (userId) => {
      this.onUserOffline?.(userId);
    });

    this.connection.on('OnlineUsers', (users) => {
      this.onOnlineUsers?.(users);
    });

    // Typing events
    this.connection.on('UserStartedTyping', (userId, chatId) => {
      this.onUserStartedTyping?.(userId, chatId);
    });

    this.connection.on('UserStoppedTyping', (userId, chatId) => {
      this.onUserStoppedTyping?.(userId, chatId);
    });

    // Chat events
    this.connection.on('MessagesRead', (userId, chatId) => {
      this.onMessagesRead?.(userId, chatId);
    });

    this.connection.on('UserJoinedChat', (userId, chatId) => {
      this.onUserJoinedChat?.(userId, chatId);
    });

    this.connection.on('UserLeftChat', (userId, chatId) => {
      this.onUserLeftChat?.(userId, chatId);
    });

    // Error handling
    this.connection.on('Error', (error) => {
      this.onError?.(error);
    });

    // Connection state changes
    this.connection.onreconnecting((error) => {
      console.log('SignalR Reconnecting:', error);
      this.onReconnecting?.(error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR Reconnected:', connectionId);
      this.onReconnected?.(connectionId);
    });

    this.connection.onclose((error) => {
      console.log('SignalR Connection Closed:', error);
      this.isConnected = false;
      this.onConnectionClosed?.(error);
    });
  }

  // Hub method calls
  public async sendMessage(receiverId: number, message: string): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('SendMessage', receiverId, message);
    }
  }

  public async joinChat(chatId: number): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('JoinChat', chatId);
    }
  }

  public async leaveChat(chatId: number): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('LeaveChat', chatId);
    }
  }

  public async startTyping(chatId: number): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('StartTyping', chatId);
    }
  }

  public async stopTyping(chatId: number): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('StopTyping', chatId);
    }
  }

  public async getOnlineUsers(): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('GetOnlineUsers');
    }
  }

  public async markMessagesAsRead(chatId: number): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('MarkMessagesAsRead', chatId);
    }
  }

  // Event handlers (to be set by components)
  public onMessageReceived?: (messageData: any) => void;
  public onUserOnline?: (userId: string) => void;
  public onUserOffline?: (userId: string) => void;
  public onOnlineUsers?: (users: string[]) => void;
  public onUserStartedTyping?: (userId: string, chatId: number) => void;
  public onUserStoppedTyping?: (userId: string, chatId: number) => void;
  public onMessagesRead?: (userId: string, chatId: number) => void;
  public onUserJoinedChat?: (userId: string, chatId: number) => void;
  public onUserLeftChat?: (userId: string, chatId: number) => void;
  public onError?: (error: string) => void;
  public onReconnecting?: (error?: Error) => void;
  public onReconnected?: (connectionId?: string) => void;
  public onConnectionClosed?: (error?: Error) => void;

  // Getters
  public get connected(): boolean {
    return this.isConnected;
  }

  public get connectionId(): string | null {
    return this.connection?.connectionId || null;
  }
}