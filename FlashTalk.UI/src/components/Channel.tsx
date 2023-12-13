import { Box, IconButton, InputBase, Stack } from "@mui/material";
import ChannelBar from "./ChannelBar";
import { Chat } from "../models/Chat";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Message as MessageModel } from "../models/Message";
import { sendMessage } from "../services/MessageService";

interface ChannelProps {
  chat: Chat;
  userId: string;
  handleErrorAlert: (message: string) => void;
  updateMessages: (
    chatId: string,
    messages: MessageModel[],
    chat?: Chat
  ) => void;
  token: string;
}

export default function Channel({
  chat,
  userId,
  handleErrorAlert,
  updateMessages,
  token,
}: ChannelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chat.messages);
  const [newChat, setNewChat] = useState<Chat>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
  }, [chat.id]);

  function handleSendMessage(
    event: MouseEvent<HTMLButtonElement> | React.KeyboardEvent
  ) {
    event.preventDefault();
    if (message.trim() === "") return;

    appendMockMessage();

    sendMessage(
      message,
      parseInt(userId),
      parseInt(chat.participants.find((p) => p.id != userId)?.id ?? ""),
      token
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        removeMockMessage();
        const newMessage = data.messages.sort(
          (a: MessageModel, b: MessageModel) => parseInt(b.id) - parseInt(a.id)
        )[0];
        setMessages([...messages, newMessage as MessageModel]);
        if (chat.id === "0") {
          setNewChat(data);
        }
      })
      .catch((error) => {
        removeMockMessage();
        handleErrorAlert(error.message);
      });

    setMessage("");
  }

  function appendMockMessage() {
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
      text: message,
      loading: true,
    };

    setMessages([...messages, mockMessage as MessageModel]);
  }

  function removeMockMessage() {
    const updatedMessages = [...messages];
    updatedMessages.pop();
    setMessages(updatedMessages);
  }

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
            />
          ))}
        <Box ref={messagesEndRef} />
      </Box>
      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <InputBase
          sx={{ ml: 1, flex: 1, width: "calc(100% - 60px)" }}
          placeholder="Type your message"
          inputProps={{ "aria-label": "search google maps" }}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSendMessage(event);
            }
          }}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="delete"
          onClick={(event) => handleSendMessage(event)}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
}
