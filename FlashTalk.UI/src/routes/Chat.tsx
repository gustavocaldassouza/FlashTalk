import { useParams } from "react-router-dom";
import MessageReceivingService from "../services/MessageReceivingService";
import { MouseEvent, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Chat as ChatModel } from "../models/Chat";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Grid,
  List,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChannelItem from "../components/ChannelItem";
import ChannelBar from "../components/ChannelBar";

const defaultTheme = createTheme();

function Chat() {
  const { userid } = useParams();
  const [open, setOpen] = useState(false);
  const [channelSelected, setChannelSelected] = useState<ChatModel>();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatModel[]>([]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    function handleGetMessages() {
      new MessageReceivingService()
        .getMessages(userid ?? "")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setChats(data);
        })
        .catch((error) => {
          setOpen(true);
          setMessage(error.message);
        });
    }
    handleGetMessages();
  }, [userid]);

  useEffect(() => {}, [channelSelected]);

  function handleListItemClick(
    _event: MouseEvent<HTMLDivElement>,
    id: string
  ): void {
    setChannelSelected(chats.find((chat) => chat.id === id) as ChatModel);
  }

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      </Snackbar>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <ChatIcon sx={{ mr: 2 }} />
              <Typography variant="h6" color="inherit" noWrap>
                FlashTalk
              </Typography>
            </Box>
            <Avatar alt="1" />
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Grid container columns={18}>
        <Grid item xs={5}>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              padding: 0,
            }}
          >
            {chats &&
              chats.map((chat) => (
                <ChannelItem
                  key={chat.id}
                  chat={chat}
                  handleListItemClick={handleListItemClick}
                />
              ))}
          </List>
        </Grid>
        <Grid item xs={13}>
          <Paper elevation={0} sx={{ height: "100%" }}>
            {!channelSelected && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                Select a conversation to start.
              </Typography>
            )}
            {channelSelected && <ChannelBar chat={channelSelected} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Chat;
