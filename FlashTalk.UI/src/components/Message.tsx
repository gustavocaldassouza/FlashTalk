import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Message as MessageModel } from "../models/Message";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Document as DocumentModel } from "../models/Document";

interface MessageProps {
  message: MessageModel;
  userId: string;
  loading: boolean;
  isRead: boolean;
  handleFileClick: (file: DocumentModel) => void;
}

export default function Message({
  message,
  userId,
  loading,
  isRead,
  handleFileClick,
}: MessageProps) {
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
      {message.text && (
        <Typography paddingTop="5px" paddingLeft="10px">
          {message.text}
        </Typography>
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
      </Box>
    </Box>
  );
}
