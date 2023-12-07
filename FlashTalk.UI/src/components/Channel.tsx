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
  updateMessages: (chatId: string, messages: MessageModel[]) => void;
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    updateMessages(chat.id, messages); // Cannot add updateMessages to the dependency array because it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.id, messages]);

  useEffect(() => {
    setMessage("");
    setMessages(chat.messages);
  }, [chat]);

  function handleSendMessage(
    event: MouseEvent<HTMLButtonElement> | React.KeyboardEvent
  ) {
    event.preventDefault();
    if (message.trim() === "") return;
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
        const newMessage = data.messages.pop();
        setMessages([...messages, newMessage as MessageModel]);
      })
      .catch((error) => {
        handleErrorAlert(error.message);
      });

    setMessage("");
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
            <Message key={message.id} message={message} userId={userId} />
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
