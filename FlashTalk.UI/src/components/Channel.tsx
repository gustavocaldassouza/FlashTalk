import { Box } from "@mui/material";
import ChannelBar from "./ChannelBar";
import { Chat } from "../models/Chat";

interface ChannelProps {
  chat: Chat;
}

export default function Channel({ chat }: ChannelProps) {
  return (
    <Box>
      <ChannelBar chat={chat}></ChannelBar>
    </Box>
  );
}
