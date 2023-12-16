import {
  Box,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Badge,
  Typography,
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
              <Avatar
                sx={{
                  backgroundColor: chat.participants.find((p) => p.id != userId)
                    ?.color,
                }}
              >
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
                  )[chat.messages.length - 1]?.text ??
                    chat.messages.sort(
                      (a, b) => parseInt(a.id) - parseInt(b.id)
                    )[chat.messages.length - 1]?.documents?.[
                      (chat.messages.sort(
                        (a, b) => parseInt(a.id) - parseInt(b.id)
                      )[chat.messages.length - 1]?.documents?.length ?? 0) - 1
                    ]?.fileName ??
                    ""}
                </>
              }
              secondaryTypographyProps={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            />
            <Box mt={-2}>
              <Typography variant="caption" color={"gray"} textAlign={"right"}>
                {new Date(chat.createdAt).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Badge
                badgeContent={
                  chat.messages.find((m) => m.sender.id != userId && !m.isRead)
                    ? chat.messages.filter(
                        (m) => m.sender.id != userId && !m.isRead
                      ).length
                    : 0
                }
                color="primary"
                sx={{ marginLeft: "auto", display: "block", mt: 1.5, mr: 1 }}
              />
            </Box>
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </Box>
      )}
    </>
  );
}
