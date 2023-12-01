import {
  Box,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { MouseEvent } from "react";
import { User } from "../models/User";

interface UserItemProps {
  user: User;
  userId: string;
  handleUserItemClick: (event: MouseEvent<HTMLDivElement>, user: User) => void;
}

export default function UserItem({ user, handleUserItemClick }: UserItemProps) {
  return (
    <>
      {user && (
        <Box key={user.id}>
          <ListItemButton onClick={(event) => handleUserItemClick(event, user)}>
            <ListItemAvatar>
              <Avatar>{user?.name?.[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user?.name}
              secondary={"Developer"}
              secondaryTypographyProps={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            />
            <ListItemText
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
