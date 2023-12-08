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
  handleChannelItemClick: (
    event: MouseEvent<HTMLDivElement>,
    chatId: string
  ) => void;
}

export default function ChannelItem({
  chat,
  userId,
  handleChannelItemClick,
}: ChannelItemProps) {
  return (
    <>
      {chat && (
        <Box key={chat.id}>
          <ListItemButton
            onClick={(event) => handleChannelItemClick(event, chat.id)}
          >
            <ListItemAvatar>
              <Avatar>
                {chat.participants.find((p) => p.id != userId)?.name?.[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.participants.find((p) => p.id != userId)?.name}
              secondary={
                <>
                  {chat.messages.sort(
                    (a, b) => parseInt(a.id) - parseInt(b.id)
                  )[chat.messages.length - 1]?.sender.id === userId ? (
                    <strong>You: </strong>
                  ) : (
                    ""
                  )}
                  {chat.messages.sort(
                    (a, b) => parseInt(a.id) - parseInt(b.id)
                  )[chat.messages.length - 1]?.text ?? ""}
                </>
              }
              secondaryTypographyProps={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            />
            <ListItemText
              secondary={new Date(chat.createdAt).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
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
