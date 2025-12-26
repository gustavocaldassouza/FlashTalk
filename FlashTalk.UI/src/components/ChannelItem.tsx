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
  isOnline?: boolean;
}

export default function ChannelItem({
  chat,
  userId,
  handleChannelItemClick,
  isOnline = false,
}: ChannelItemProps) {
  return (
    <>
      {chat && (
        <Box key={chat.id}>
          <ListItemButton
            onClick={(event) => handleChannelItemClick(event, chat.id)}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: isOnline ? '#44b700' : 'transparent',
                    color: isOnline ? '#44b700' : 'transparent',
                    boxShadow: isOnline ? '0 0 0 2px #fff' : 'none',
                    '&::after': isOnline ? {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      animation: 'ripple 1.2s infinite ease-in-out',
                      border: '1px solid currentColor',
                      content: '""',
                    } : {},
                  },
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: chat.participants.find((p) => p.id != userId)
                      ?.color,
                  }}
                >
                  {chat.participants.find((p) => p.id != userId)?.name?.[0]}
                </Avatar>
              </Badge>
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
