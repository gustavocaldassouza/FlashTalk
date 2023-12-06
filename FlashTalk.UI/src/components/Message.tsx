import { Box, Typography } from "@mui/material";
import { Message as MessageModel } from "../models/Message";

interface MessageProps {
  message: MessageModel;
  userId: string;
}

export default function Message({ message, userId }: MessageProps) {
  return (
    <Box>
      <Box
        maxWidth="50%"
        width="25%"
        height={"35px"}
        paddingBottom={1}
        margin={1}
        display={"flex"}
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
        <Typography
          textAlign={"right"}
          variant="caption"
          width={"85px"}
          marginTop={"15px"}
          marginRight={"10px"}
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
