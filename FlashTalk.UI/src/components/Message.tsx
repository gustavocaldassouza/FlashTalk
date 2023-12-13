import { Box, CircularProgress, Typography } from "@mui/material";
import { Message as MessageModel } from "../models/Message";
import CheckIcon from "@mui/icons-material/Check";

interface MessageProps {
  message: MessageModel;
  userId: string;
  loading: boolean;
}

export default function Message({ message, userId, loading }: MessageProps) {
  return (
    <Box>
      <Box
        maxWidth="50%"
        width="25%"
        height={"35px"}
        paddingBottom={1}
        margin={1}
        display={"flex"}
        flexDirection={"row"}
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
        <Typography
          paddingTop="5px"
          paddingLeft="10px"
          display={"block"}
          width={"100%"}
        >
          {message.text}
        </Typography>
        <Box width={20}>
          {loading ? (
            <CircularProgress sx={{ color: "white", mt: 2.2 }} size={10} />
          ) : (
            <CheckIcon
              sx={{
                fontSize: 15,
                mt: 2,
                color: message.sender.id == userId ? "white" : "#9e9e9e",
              }}
            />
          )}
        </Box>
        <Typography
          textAlign={"right"}
          variant="caption"
          fontSize={".7rem"}
          width={"85px"}
          marginTop={"15px"}
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
