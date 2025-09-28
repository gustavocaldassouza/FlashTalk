import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSignalR } from '../hooks/useSignalR';

interface SignalRContextType {
  isConnected: boolean;
  isConnecting: boolean;
  onlineUsers: string[];
  typingUsers: { [chatId: number]: string[] };
  sendMessage: (receiverId: number, message: string) => Promise<void>;
  joinChat: (chatId: number) => Promise<void>;
  leaveChat: (chatId: number) => Promise<void>;
  startTyping: (chatId: number) => Promise<void>;
  stopTyping: (chatId: number) => Promise<void>;
  markMessagesAsRead: (chatId: number) => Promise<void>;
  getOnlineUsers: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

interface SignalRProviderProps {
  children: React.ReactNode;
  token: string;
  onMessageReceived?: (messageData: any) => void;
  onError?: (error: string) => void;
}

export function SignalRProvider({ 
  children, 
  token, 
  onMessageReceived,
  onError 
}: SignalRProviderProps) {
  const signalR = useSignalR({
    token,
    autoConnect: true,
    onMessageReceived,
    onUserOnline: (userId) => {
      console.log('User came online:', userId);
    },
    onUserOffline: (userId) => {
      console.log('User went offline:', userId);
    },
    onUserStartedTyping: (userId, chatId) => {
      console.log('User started typing:', { userId, chatId });
    },
    onUserStoppedTyping: (userId, chatId) => {
      console.log('User stopped typing:', { userId, chatId });
    },
    onMessagesRead: (userId, chatId) => {
      console.log('Messages read:', { userId, chatId });
    },
    onError: (error) => {
      console.error('SignalR Error:', error);
      onError?.(error);
    }
  });

  const contextValue: SignalRContextType = {
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    onlineUsers: signalR.onlineUsers,
    typingUsers: signalR.typingUsers,
    sendMessage: signalR.sendMessage,
    joinChat: signalR.joinChat,
    leaveChat: signalR.leaveChat,
    startTyping: signalR.startTyping,
    stopTyping: signalR.stopTyping,
    markMessagesAsRead: signalR.markMessagesAsRead,
    getOnlineUsers: signalR.getOnlineUsers
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalRContext(): SignalRContextType {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalRContext must be used within a SignalRProvider');
  }
  return context;
}

// Connection status indicator component
export function SignalRStatus() {
  const { isConnected, isConnecting } = useSignalRContext();
  
  if (isConnecting) {
    return (
      <div style={{ color: 'orange', fontSize: '12px' }}>
        🟡 Connecting...
      </div>
    );
  }
  
  if (isConnected) {
    return (
      <div style={{ color: 'green', fontSize: '12px' }}>
        🟢 Connected
      </div>
    );
  }
  
  return (
    <div style={{ color: 'red', fontSize: '12px' }}>
      🔴 Disconnected
    </div>
  );
}