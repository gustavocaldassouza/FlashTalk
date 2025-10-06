import { Box, IconButton, InputBase, Stack, styled, Typography } from "@mui/material";
import ChannelBar from "./ChannelBar";
import { Chat } from "../models/Chat";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Message as MessageModel } from "../models/Message";
import {
  getFileMessage,
  readMessagesByChat,
  sendFileMessage,
} from "../services/MessageService";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Document as DocumentModel } from "../models/Document";

interface ChannelProps {
  chat: Chat;
  userId: string;
  userName: string;
  handleErrorAlert: (message: string) => void;
  updateMessages: (
    chatId: string,
    messages: MessageModel[],
    chat?: Chat
  ) => void;
  token: string;
  onSendMessage: (chatId: number, message: string, senderId: number, senderName: string) => Promise<void>;
  onStartTyping: (chatId: number, userId: number, userName: string) => Promise<void>;
  onStopTyping: (chatId: number, userId: number, userName: string) => Promise<void>;
  typingUsers: Set<number>;
}

export default function Channel({
  chat,
  userId,
  userName,
  handleErrorAlert,
  updateMessages,
  token,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  typingUsers,
}: ChannelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chat.messages);
  const [newChat, setNewChat] = useState<Chat>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    readMessagesByChat(chat.id, token)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const messages = data.messages.sort(
          (a: MessageModel, b: MessageModel) => parseInt(b.id) - parseInt(a.id)
        );
        setMessages(messages);
      })
      .catch((error) => {
        handleErrorAlert(error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) {
      updateMessages(chat.id, messages);
    } // Cannot add updateMessages to the dependency array because it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (newChat) {
      updateMessages(newChat?.id, messages, newChat);
      setNewChat(undefined); // Cannot add updateMessages to the dependency array because it will cause an infinite loop
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChat]);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.messages]);

  useEffect(() => {
    setMessage("");
    // Clean up typing timeout when changing chats
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [chat.id]);

  // Handle typing indicator
  async function handleInputChange(value: string) {
    setMessage(value);

    if (value.trim().length > 0) {
      // Send typing started event
      await onStartTyping(parseInt(chat.id), parseInt(userId), userName);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to send stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(async () => {
        await onStopTyping(parseInt(chat.id), parseInt(userId), userName);
        typingTimeoutRef.current = null;
      }, 3000);
    } else if (typingTimeoutRef.current) {
      // If message is empty, stop typing indicator
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      await onStopTyping(parseInt(chat.id), parseInt(userId), userName);
    }
  }

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  async function handleSendMessage(
    event: MouseEvent<HTMLButtonElement> | React.KeyboardEvent
  ) {
    event.preventDefault();
    if (message.trim() === "") return;

    const messageToSend = message;
    setMessage("");

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    await onStopTyping(parseInt(chat.id), parseInt(userId), userName);

    try {
      // Send message via SignalR
      await onSendMessage(
        parseInt(chat.id),
        messageToSend,
        parseInt(userId),
        userName
      );
    } catch (error) {
      handleErrorAlert(error instanceof Error ? error.message : 'Failed to send message');
      // Restore message if send failed
      setMessage(messageToSend);
    }
  }

  function setNewMessages(data?: Chat) {
    const newMessage = data!.messages.sort(
      (a: MessageModel, b: MessageModel) => parseInt(b.id) - parseInt(a.id)
    )[0];
    setMessages([...messages, newMessage as MessageModel]);
    if (chat.id === "0") {
      setNewChat(data);
    }
  }

  function appendFileBasedMockMessage(files: FileList) {
    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const mockMessage: MessageModel = {
      id: "0",
      createdAt: utc,
      sender: {
        id: userId,
        name: "",
        email: "",
        password: "",
        color: "",
      },
      isRead: false,
      text: message,
      loading: true,
      documents: [],
    };

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (!file) continue;
      const fileModel: DocumentModel = {
        fileName: file.name,
      };
      mockMessage!.documents!.push(fileModel);
    }

    setMessages([...messages, mockMessage as MessageModel]);
  }

  function removeMockMessage() {
    const updatedMessages = [...messages];
    updatedMessages.pop();
    setMessages(updatedMessages);
  }

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    appendFileBasedMockMessage(files);
    sendFileMessage(
      files,
      chat.participants.find((p) => p.id !== userId)!.id,
      token
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Chat) => {
        removeMockMessage();
        setNewMessages(data);
      })
      .catch((error) => {
        removeMockMessage();
        handleErrorAlert(error.message);
      });
  }

  function handleFileClick(file: DocumentModel, messageId: string) {
    getFileMessage(token, messageId, file.fileName!)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      })
      .then((data) => {
        data.blob().then((blob) => {
          // Create a download link
          const downloadLink = document.createElement("a");
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = file.fileName || ""; // Set the downloaded file name
          // Trigger the download
          downloadLink.click();
          // Cleanup the object URL
          window.URL.revokeObjectURL(downloadLink.href);
        });
      })
      .catch((error) => {
        handleErrorAlert(error.message);
      });
  }

  // Get typing users for this chat (excluding current user)
  const typingUsersInChat = chat.participants
    .filter((p) => p.id !== userId && typingUsers.has(parseInt(p.id)))
    .map((p) => p.name);

  return (
    <Stack spacing={1}>
      <ChannelBar chat={chat} userId={userId}></ChannelBar>
      <Box height="calc(100vh - 121px)" overflow={"auto"}>
        {[...messages]
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
          .map((message) => (
            <Message
              key={message.id}
              message={message}
              userId={userId}
              loading={message.loading || false}
              isRead={message.isRead}
              handleFileClick={(file: DocumentModel) =>
                handleFileClick(file, message.id)
              }
            />
          ))}
        {typingUsersInChat.length > 0 && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: 'italic',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              {typingUsersInChat.join(', ')} {typingUsersInChat.length === 1 ? 'is' : 'are'} typing...
            </Typography>
          </Box>
        )}
        <Box ref={messagesEndRef} />
      </Box>
      <Box
        sx={{ backgroundColor: "#f5f5f5" }}
        display={"flex"}
        flexDirection={"row"}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: "calc(100% - 60px)" }}
          placeholder="Type your message"
          inputProps={{ "aria-label": "Type your message" }}
          value={message}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSendMessage(event);
            }
          }}
        />
        <IconButton component="label">
          <AttachFileIcon sx={{ fontSize: 20 }} />
          <VisuallyHiddenInput
            type="file"
            multiple
            onChange={(event) => {
              handleFileInput(event);
            }}
          />
        </IconButton>
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="send message"
          onClick={(event) => handleSendMessage(event)}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
