import { Box, Button, CircularProgress, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Message as MessageModel } from "../models/Message";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Document as DocumentModel } from "../models/Document";
import { useState } from "react";

interface MessageProps {
  message: MessageModel;
  userId: string;
  loading: boolean;
  isRead: boolean;
  handleFileClick: (file: DocumentModel) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export default function Message({
  message,
  userId,
  loading,
  isRead,
  handleFileClick,
  onEdit,
  onDelete,
}: MessageProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOwner = message.sender.id === userId;
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(message.id);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    handleMenuClose();
  };

  const canEdit = isOwner && !message.isDeleted;
  const canDelete = isOwner && !message.isDeleted;

  return (
    <Box
      maxWidth="calc(50% - 20px)"
      width={"fit-content"}
      margin={1}
      display={"flex"}
      flexDirection={"column"}
      sx={{
        backgroundColor: message.sender.id == userId ? "#1976D2" : "#f5f5f5",
        color: message.sender.id == userId ? "white" : "black",
        borderRadius:
          message.sender.id == userId
            ? "10px 10px 0px 10px"
            : "10px 10px 10px 0px",
        marginLeft: message.sender.id == userId ? "auto" : "none",
        position: "relative",
      }}
    >
      {message.documents &&
        message.documents.map((document, index) => (
          <Box
            key={index}
            overflow={"hidden"}
            mr={0.5}
            sx={{
              borderRadius:
                message.sender.id == userId
                  ? "10px 10px 0px 10px"
                  : "10px 10px 10px 0px",
            }}
          >
            <Button
              key={index}
              onClick={() => handleFileClick(document)}
              startIcon={<InsertDriveFileOutlinedIcon />}
              variant="contained"
              sx={{
                backgroundColor: "#f5f5f5",
                color: "#1976D2",
                whiteSpace: "nowrap",
                width: "100%",
                mr: 0.5,
                ml: 0.5,
                mt: 0.5,
                ":hover": {
                  backgroundColor: "#f5f5f5",
                  color: "#1976D2",
                },
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                overflow={"hidden"}
                textOverflow={"ellipsis"}
              >
                {document.fileName}
              </Typography>
            </Button>
          </Box>
        ))}
      {message.isDeleted ? (
        <Typography paddingTop="5px" paddingLeft="10px" fontStyle="italic" opacity={0.7}>
          [Deleted]
        </Typography>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            {message.text && (
              <Typography paddingTop="5px" paddingLeft="10px" flex={1}>
                {message.text}
              </Typography>
            )}
            {isOwner && (onEdit || onDelete) && (
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                  color: message.sender.id == userId ? "white" : "inherit",
                  opacity: 0.7,
                  "&:hover": { opacity: 1 },
                  ml: 1,
                  mt: 0.5,
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            sx={{
              "& .MuiMenu-paper": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            {canEdit && onEdit && (
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            )}
            {canDelete && onDelete && (
              <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
                Delete
              </MenuItem>
            )}
          </Menu>
        </>
      )}
      <Box
        display={"flex"}
        flexDirection={"row"}
        textAlign={"right"}
        justifyContent={"right"}
      >
        <Box mr={1} ml={1}>
          {loading && (
            <CircularProgress
              sx={{ color: "white", position: "relative", bottom: "2.5px" }}
              size={10}
            />
          )}
          {!isRead && !loading && (
            <CheckIcon
              sx={{
                fontSize: 15,
                color: message.sender.id == userId ? "white" : "#9e9e9e",
              }}
            />
          )}
          {isRead && !loading && message.sender.id === userId && (
            <VisibilityIcon
              sx={{
                fontSize: 15,
                color: message.sender.id == userId ? "white" : "#9e9e9e",
              }}
            />
          )}
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography
            textAlign={"right"}
            variant="caption"
            fontSize={".7rem"}
            display={"inline-block"}
            marginRight={"10px"}
            color={message.sender.id == userId ? "white" : "#9e9e9e"}
          >
            {new Date(message.createdAt).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {message.editedAt && (
            <Typography
              variant="caption"
              fontSize={".65rem"}
              marginRight={"10px"}
              color={message.sender.id == userId ? "white" : "#9e9e9e"}
              fontStyle="italic"
            >
              (edited)
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
