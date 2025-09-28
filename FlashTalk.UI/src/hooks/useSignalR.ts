import { useEffect, useRef, useState } from 'react';
import { SignalRService } from '../services/SignalRService';

export interface UseSignalRProps {
  token: string;
  autoConnect?: boolean;
  onMessageReceived?: (messageData: any) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
  onOnlineUsers?: (users: string[]) => void;
  onUserStartedTyping?: (userId: string, chatId: number) => void;
  onUserStoppedTyping?: (userId: string, chatId: number) => void;
  onMessagesRead?: (userId: string, chatId: number) => void;
  onError?: (error: string) => void;
}

export function useSignalR({
  token,
  autoConnect = true,
  onMessageReceived,
  onUserOnline,
  onUserOffline,
  onOnlineUsers,
  onUserStartedTyping,
  onUserStoppedTyping,
  onMessagesRead,
  onError
}: UseSignalRProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [chatId: number]: string[] }>({});
  const signalRServiceRef = useRef<SignalRService | null>(null);

  const connect = async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    try {
      signalRServiceRef.current = new SignalRService(token);
      
      // Set up event handlers
      signalRServiceRef.current.onMessageReceived = onMessageReceived;
      signalRServiceRef.current.onUserOnline = (userId) => {
        setOnlineUsers(prev => [...new Set([...prev, userId])]);
        onUserOnline?.(userId);
      };
      signalRServiceRef.current.onUserOffline = (userId) => {
        setOnlineUsers(prev => prev.filter(u => u !== userId));
        onUserOffline?.(userId);
      };
      signalRServiceRef.current.onOnlineUsers = (users) => {
        setOnlineUsers(users);
        onOnlineUsers?.(users);
      };
      signalRServiceRef.current.onUserStartedTyping = (userId, chatId) => {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: [...new Set([...(prev[chatId] || []), userId])]
        }));
        onUserStartedTyping?.(userId, chatId);
      };
      signalRServiceRef.current.onUserStoppedTyping = (userId, chatId) => {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || []).filter(u => u !== userId)
        }));
        onUserStoppedTyping?.(userId, chatId);
      };
      signalRServiceRef.current.onMessagesRead = onMessagesRead;
      signalRServiceRef.current.onError = onError;
      signalRServiceRef.current.onReconnected = () => {
        setIsConnected(true);
        // Request updated online users after reconnection
        signalRServiceRef.current?.getOnlineUsers();
      };
      signalRServiceRef.current.onConnectionClosed = () => {
        setIsConnected(false);
      };

      await signalRServiceRef.current.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      onError?.(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (signalRServiceRef.current) {
      await signalRServiceRef.current.disconnect();
      signalRServiceRef.current = null;
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [token, autoConnect]);

  // Helper functions
  const sendMessage = async (receiverId: number, message: string) => {
    await signalRServiceRef.current?.sendMessage(receiverId, message);
  };

  const joinChat = async (chatId: number) => {
    await signalRServiceRef.current?.joinChat(chatId);
  };

  const leaveChat = async (chatId: number) => {
    await signalRServiceRef.current?.leaveChat(chatId);
  };

  const startTyping = async (chatId: number) => {
    await signalRServiceRef.current?.startTyping(chatId);
  };

  const stopTyping = async (chatId: number) => {
    await signalRServiceRef.current?.stopTyping(chatId);
  };

  const markMessagesAsRead = async (chatId: number) => {
    await signalRServiceRef.current?.markMessagesAsRead(chatId);
  };

  const getOnlineUsers = async () => {
    await signalRServiceRef.current?.getOnlineUsers();
  };

  return {
    // State
    isConnected,
    isConnecting,
    onlineUsers,
    typingUsers,
    
    // Methods
    connect,
    disconnect,
    sendMessage,
    joinChat,
    leaveChat,
    startTyping,
    stopTyping,
    markMessagesAsRead,
    getOnlineUsers,
    
    // Service reference (for advanced usage)
    service: signalRServiceRef.current
  };
}