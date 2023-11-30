import { Box, IconButton, InputBase, Stack } from "@mui/material";
import ChannelBar from "./ChannelBar";
import { Chat } from "../models/Chat";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { MouseEvent, useEffect, useRef, useState } from "react";
import MessageSendingService from "../services/MessageSendingService";
import { Message as MessageModel } from "../models/Message";

interface ChannelProps {
  chat: Chat;
  userId: string;
  handleErrorAlert: (message: string) => void;
}

function Channel(props: ChannelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(props.chat.messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessage("");
  }, [props.chat]);

  function handleSendMessage(
    event: MouseEvent<HTMLButtonElement> | React.KeyboardEvent
  ) {
    event.preventDefault();
    if (message.trim() === "") return;
    new MessageSendingService()
      .sendMessage(
        message,
        parseInt(props.userId),
        parseInt(
          props.chat.participants.find((p) => p.id != props.userId)?.id ?? "1"
        )
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
        props.handleErrorAlert(error.message);
      });

    setMessage("");
  }

  return (
    <Stack spacing={1}>
      <ChannelBar chat={props.chat}></ChannelBar>
      <Box height={238} overflow={"auto"}>
        {messages.map((message) => (
          <Box key={message.id}>
            <Message message={message} userId={props.userId} />
          </Box>
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
          onKeyPress={(event) => {
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

export default Channel;
