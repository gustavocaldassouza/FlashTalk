import { AppBar, Avatar, Toolbar, Typography } from "@mui/material";
import { Chat } from "../models/Chat";

interface ChannelBarProps {
  chat: Chat;
}

export default function ChannelBar({ chat }: ChannelBarProps) {
  return (
    <AppBar position="relative" color="warning" sx={{ height: 60 }}>
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Avatar alt={chat.name} sx={{ marginTop: -0.5 }} />
          <Typography variant="h6" color="inherit" noWrap marginLeft={2}>
            {chat.name}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}
