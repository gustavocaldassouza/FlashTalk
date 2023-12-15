import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Message as MessageModel } from "../models/Message";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

interface MessageProps {
  message: MessageModel;
  userId: string;
  loading: boolean;
  isRead: boolean;
  handleFileClick: (message: MessageModel) => void;
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
      maxWidth="50%"
      width="25%"
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
      <Box display={"flex"} flexDirection={"column"} width={"100%"}>
        {message.filePath && (
          <Button
            onClick={() => handleFileClick(message)}
            startIcon={<InsertDriveFileOutlinedIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#1976D2",
              whiteSpace: "nowrap",
              borderRadius: 2,
              m: 0.5,
              ":hover": {
                backgroundColor: "#f5f5f5",
                color: "#1976D2",
              },
            }}
          >
            <Typography
              variant="caption"
              overflow={"hidden"}
              textOverflow={"ellipsis"}
            >
              {message.filePath}
            </Typography>
          </Button>
        )}
        {message.text && (
          <Typography paddingTop="5px" paddingLeft="10px">
            {message.text}
          </Typography>
        )}
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        textAlign={"right"}
        justifyContent={"right"}
      >
        <Box mr={1}>
          {loading && <CircularProgress sx={{ color: "white" }} size={10} />}
          {!isRead && (
            <CheckIcon
              sx={{
                fontSize: 15,
                color: message.sender.id == userId ? "white" : "#9e9e9e",
              }}
            />
          )}
          {isRead && message.sender.id === userId && (
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
