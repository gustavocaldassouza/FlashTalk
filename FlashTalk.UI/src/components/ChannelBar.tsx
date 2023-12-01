import { AppBar, Avatar, Toolbar, Typography } from "@mui/material";
import { Chat } from "../models/Chat";

interface ChannelBarProps {
  chat: Chat;
  userId: string;
}

export default function ChannelBar({ chat, userId }: ChannelBarProps) {
  return (
    <AppBar position="relative" color="secondary">
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Avatar sx={{ marginTop: -0.5, marginRight: 2 }}>
            {chat.participants.find((p) => p.id != userId)?.name?.[0]}
          </Avatar>
          <Typography variant="h6" color="inherit" noWrap>
            {chat.participants.find((p) => p.id != userId)?.name}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}
