import { AppBar, Avatar, ListItemText, Toolbar } from "@mui/material";
import { Chat } from "../models/Chat";

interface ChannelBarProps {
  chat: Chat;
  userId: string;
}

export default function ChannelBar({ chat, userId }: ChannelBarProps) {
  return (
    <AppBar position="relative" sx={{ backgroundColor: "white" }} elevation={1}>
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
          <Avatar
            sx={{
              marginRight: 2,
              marginTop: "8px",
              backgroundColor: chat.participants.find((p) => p.id != userId)
                ?.color,
            }}
          >
            {chat.participants.find((p) => p.id != userId)?.name?.[0]}
          </Avatar>
          <ListItemText
            primary={chat.participants.find((p) => p.id != userId)?.name}
            primaryTypographyProps={{
              fontSize: "1.2rem",
              color: "black",
            }}
            secondary={"Developer"}
            secondaryTypographyProps={{
              color: "black",
            }}
          />
          {/* <Typography variant="h6" color="inherit" noWrap>
            {chat.participants.find((p) => p.id != userId)?.name}
          </Typography> */}
        </div>
      </Toolbar>
    </AppBar>
  );
}
