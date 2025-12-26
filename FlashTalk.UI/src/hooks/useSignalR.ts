import { useEffect, useRef, useState, useCallback } from 'react';
import { SignalRService, ChatMessage, UserOnlineStatus, TypingUser, ChatParticipant } from '../services/signalRService';

interface UseSignalROptions {
    baseUrl: string;
    token: string;
    autoConnect?: boolean;
}

interface UseSignalRReturn {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    joinChat: (chatId: number) => Promise<void>;
    leaveChat: (chatId: number) => Promise<void>;
    sendMessage: (chatId: number, message: string, senderId: number, senderName: string) => Promise<void>;
    startTyping: (chatId: number, userId: number, userName: string) => Promise<void>;
    stopTyping: (chatId: number, userId: number, userName: string) => Promise<void>;
    getOnlineUsers: () => Promise<void>;
    getChatParticipants: (chatId: number) => Promise<void>;
    onMessageReceived: (callback: (message: ChatMessage) => void) => void;
    onUserOnline: (callback: (user: UserOnlineStatus) => void) => void;
    onUserOffline: (callback: (user: UserOnlineStatus) => void) => void;
    onOnlineUsersReceived: (callback: (users: UserOnlineStatus[]) => void) => void;
    onChatParticipantsReceived: (callback: (data: { chatId: number; participants: ChatParticipant[] }) => void) => void;
    onUserStartedTyping: (callback: (typingUser: TypingUser) => void) => void;
    onUserStoppedTyping: (callback: (typingUser: TypingUser) => void) => void;
}

export function useSignalR({ baseUrl, token, autoConnect = true }: UseSignalROptions): UseSignalRReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const serviceRef = useRef<SignalRService | null>(null);

    // Initialize service when token changes
    useEffect(() => {
        if (token && baseUrl) {
            serviceRef.current = new SignalRService(baseUrl, token);
        }
    }, [token, baseUrl]);

    const connect = useCallback(async () => {
        if (!serviceRef.current) {
            setError('SignalR service not initialized');
            return;
        }

        if (isConnected || isConnecting) {
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            await serviceRef.current.connect();
            setIsConnected(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect to SignalR';
            setError(errorMessage);
            console.error('SignalR connection error:', err);
        } finally {
            setIsConnecting(false);
        }
    }, [isConnected, isConnecting]);

    const disconnect = useCallback(async () => {
        if (!serviceRef.current) {
            return;
        }

        try {
            await serviceRef.current.disconnect();
            setIsConnected(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect from SignalR';
            setError(errorMessage);
            console.error('SignalR disconnection error:', err);
        }
    }, []);

    const joinChat = useCallback(async (chatId: number) => {
        if (!serviceRef.current) {
            throw new Error('SignalR service not initialized');
        }
        await serviceRef.current.joinChat(chatId);
    }, []);

    const leaveChat = useCallback(async (chatId: number) => {
        if (!serviceRef.current) {
            throw new Error('SignalR service not initialized');
        }
        await serviceRef.current.leaveChat(chatId);
    }, []);

    const sendMessage = useCallback(async (chatId: number, message: string, senderId: number, senderName: string) => {
        if (!serviceRef.current) {
            throw new Error('SignalR service not initialized');
        }
        await serviceRef.current.sendMessage(chatId, message, senderId, senderName);
    }, []);

    const startTyping = useCallback(async (chatId: number, userId: number, userName: string) => {
        if (!serviceRef.current) {
            return;
        }
        await serviceRef.current.startTyping(chatId, userId, userName);
    }, []);

    const stopTyping = useCallback(async (chatId: number, userId: number, userName: string) => {
        if (!serviceRef.current) {
            return;
        }
        await serviceRef.current.stopTyping(chatId, userId, userName);
    }, []);

    const getOnlineUsers = useCallback(async () => {
        if (!serviceRef.current) {
            throw new Error('SignalR service not initialized');
        }
        await serviceRef.current.getOnlineUsers();
    }, []);

    const getChatParticipants = useCallback(async (chatId: number) => {
        if (!serviceRef.current) {
            throw new Error('SignalR service not initialized');
        }
        await serviceRef.current.getChatParticipants(chatId);
    }, []);

    const onMessageReceived = useCallback((callback: (message: ChatMessage) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onMessageReceived(callback);
        }
    }, []);

    const onUserOnline = useCallback((callback: (user: UserOnlineStatus) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onUserOnline(callback);
        }
    }, []);

    const onUserOffline = useCallback((callback: (user: UserOnlineStatus) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onUserOffline(callback);
        }
    }, []);

    const onOnlineUsersReceived = useCallback((callback: (users: UserOnlineStatus[]) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onOnlineUsers(callback);
        }
    }, []);

    const onChatParticipantsReceived = useCallback((callback: (data: { chatId: number; participants: ChatParticipant[] }) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onChatParticipants(callback);
        }
    }, []);

    const onUserStartedTyping = useCallback((callback: (typingUser: TypingUser) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onUserStartedTyping(callback);
        }
    }, []);

    const onUserStoppedTyping = useCallback((callback: (typingUser: TypingUser) => void) => {
        if (serviceRef.current) {
            // Remove any existing handler first
            serviceRef.current.onUserStoppedTyping(callback);
        }
    }, []);

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect && token && baseUrl && !isConnected && !isConnecting) {
            connect();
        }
    }, [autoConnect, token, baseUrl, isConnected, isConnecting, connect]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (serviceRef.current?.isConnected()) {
                serviceRef.current.disconnect();
            }
        };
    }, []);

    return {
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        joinChat,
        leaveChat,
        sendMessage,
        startTyping,
        stopTyping,
        getOnlineUsers,
        getChatParticipants,
        onMessageReceived,
        onUserOnline,
        onUserOffline,
        onOnlineUsersReceived,
        onChatParticipantsReceived,
        onUserStartedTyping,
        onUserStoppedTyping,
    };
}

