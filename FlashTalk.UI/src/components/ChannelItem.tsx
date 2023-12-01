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
  userId: string;
  chat: Chat;
  handleListItemClick: (
    event: MouseEvent<HTMLDivElement>,
    chatId: string
  ) => void;
}

export default function ChannelItem({
  chat,
  userId,
  handleListItemClick,
}: ChannelItemProps) {
  return (
    <>
      {chat && (
        <Box key={chat.id}>
          <ListItemButton
            onClick={(event) => handleListItemClick(event, chat.id)}
          >
            <ListItemAvatar>
              <Avatar>
                {chat.participants.find((p) => p.id != userId)?.name?.[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.participants.find((p) => p.id != userId)?.name}
              secondary={chat.messages[chat.messages.length - 1]?.text ?? ""}
              secondaryTypographyProps={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            />
            <ListItemText
              secondary={new Date(chat.createdAt).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                // day: "2-digit",
                // month: "2-digit",
                // year: "numeric",
              })}
              secondaryTypographyProps={{
                fontSize: "0.8rem",
                textAlign: "right",
              }}
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </Box>
      )}
    </>
  );
}
