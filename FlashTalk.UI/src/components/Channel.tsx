import { Box, IconButton, InputBase, Stack, Typography } from "@mui/material";
import ChannelBar from "./ChannelBar";
import { Chat } from "../models/Chat";
import SendIcon from "@mui/icons-material/Send";

interface ChannelProps {
  chat: Chat;
}

const numbers = [1, 2, 3];

export default function Channel({ chat }: ChannelProps) {
  return (
    <Stack spacing={1}>
      <ChannelBar chat={chat}></ChannelBar>
      <Box height={238} overflow={"auto"}>
        {numbers.map((number) => (
          <Box key={number}>
            <Box>
              <Box
                maxWidth="50%"
                width="25%"
                height={37}
                margin={1}
                sx={{
                  backgroundColor: "#F5F5F5",
                  color: "black",
                  borderRadius: "10px 10px 10px 0px",
                }}
              >
                <Typography paddingTop="8px" paddingLeft="10px">
                  Hello there!
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box
                maxWidth="50%"
                width="25%"
                height={37}
                margin={1}
                sx={{
                  backgroundColor: "#1976D2",
                  borderRadius: "10px 10px 0px 10px",
                  marginLeft: "auto",
                  color: "white",
                }}
              >
                <Typography paddingTop="8px" paddingLeft="10px">
                  Hey!
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ backgroundColor: "#f5f5f5" }}>
        <InputBase
          sx={{ ml: 1, flex: 1, width: "calc(100% - 60px)" }}
          placeholder="Type your message"
          inputProps={{ "aria-label": "search google maps" }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="delete">
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
}
