import {
  Box,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { MouseEvent } from "react";
import { Chat } from "../models/Chat";

interface ChannelItemProps {
  chat: Chat;
  handleListItemClick: (
    event: MouseEvent<HTMLDivElement>,
    chatId: string
  ) => void;
}

export default function ChannelItem({
  chat,
  handleListItemClick,
}: ChannelItemProps) {
  return (
    <Box key={chat.id}>
      <ListItemButton onClick={(event) => handleListItemClick(event, chat.id)}>
        <ListItemAvatar>
          <Avatar alt={chat.name} />
        </ListItemAvatar>
        <ListItemText
          primary={chat.name}
          secondary={"hidasdasdasdasdasdassdasdasdasdaasdasdasdsd"}
          secondaryTypographyProps={{
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        />
        <ListItemText
          secondary={new Date(chat.createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          secondaryTypographyProps={{
            fontSize: "0.8rem",
            textAlign: "right",
          }}
        />
      </ListItemButton>
      <Divider variant="inset" component="li" />
    </Box>
  );
}
