import { Box, IconButton, InputBase, Stack } from "@mui/material";
import ChannelBar from "./ChannelBar";
import { Chat } from "../models/Chat";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";

interface ChannelProps {
  chat: Chat;
  userId: string;
}

function Channel({ chat, userId }: ChannelProps) {
  return (
    <Stack spacing={1}>
      <ChannelBar chat={chat}></ChannelBar>
      <Box height={238} overflow={"auto"}>
        {chat.messages.map((message) => (
          <Box key={message.id}>
            <Message message={message} userId={userId} />
          </Box>
        ))}
      </Box>
      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <InputBase
          sx={{ ml: 1, flex: 1, width: "calc(100% - 60px)" }}
          placeholder="Type your message"
          inputProps={{ "aria-label": "search google maps" }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="delete">
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
}

export default Channel;
