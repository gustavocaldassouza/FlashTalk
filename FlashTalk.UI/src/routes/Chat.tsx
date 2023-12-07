import { useLocation } from "react-router-dom";
import { MouseEvent, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Chat as ChatModel } from "../models/Chat";
import { Message as MessageModel } from "../models/Message";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Grid,
  List,
  Paper,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
  createTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChannelItem from "../components/ChannelItem";
import Channel from "../components/Channel";
import { User } from "../models/User";
import { getUserInfo, getUsers } from "../services/UserService";
import { getMessages } from "../services/MessageService";
import UserItem from "../components/UserItem";

const defaultTheme = createTheme();

export default function Chat() {
  const [user, setUser] = useState<User>();
  const [open, setOpen] = useState(false);
  const [channelSelected, setChannelSelected] = useState<ChatModel>();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatModel[]>([]);
  const [users, setUsers] = useState<User[]>();
  const [token, setToken] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    if (location.state.token) {
      setToken(location.state.token);
      handleGetUserInfo(location.state.token);
      handleGetMessages(location.state.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.token]); // Only re-run the effect if token changes

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetMessages(location.state.token);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function handleGetMessages(tokenJWT?: string | undefined) {
    getMessages(tokenJWT ?? token)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setChats(data);
        setFilteredChats(data);
      })
      .catch((error) => {
        setOpen(true);
        setMessage(error.message);
      });
  }

  function handleGetUserInfo(tokenJWT?: string | undefined) {
    getUserInfo(tokenJWT ?? token)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        setOpen(true);
        setMessage(error.message);
      });
  }

  function handleChannelItemClick(
    _event: MouseEvent<HTMLDivElement>,
    id: string
  ): void {
    setChannelSelected(chats.find((chat) => chat.id === id) as ChatModel);
  }

  function handleUserItemClick(
    _event: MouseEvent<HTMLDivElement>,
    _user: User
  ): void {
    const newChat: ChatModel = {
      id: Number.MAX_VALUE.toString(),
      name: user!.name,
      createdAt: new Date(),
      owner: user!,
      messages: [],
      participants: [user!, _user],
    };

    setChannelSelected(newChat);
  }

  function handleErrorAlert(errorMessage: string) {
    setOpen(true);
    setMessage(errorMessage);
  }

  function updateMessages(chatId: string, messages: MessageModel[]) {
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, messages: messages };
      }
      return chat;
    });

    setChats(updatedChats);
    setFilteredChats(updatedChats);
  }

  function handleContactSearch(e: React.KeyboardEvent<HTMLDivElement>) {
    const searchValue = (e.target as HTMLInputElement).value;

    if (searchValue === "") {
      setFilteredChats(chats);
      setUsers(undefined);
      handleGetMessages();
      return;
    }

    const filteredChats = chats.filter((chat) =>
      chat.participants
        .find((p) => p.id != user?.id)
        ?.name?.toLowerCase()
        .includes(searchValue.toLowerCase())
    );

    setFilteredChats(filteredChats);
    handleGetUsers(searchValue.toLowerCase());
  }

  function handleGetUsers(userName: string) {
    getUsers(userName, token)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const filteredUsers = data.filter((u: User) => {
          const participantIds = chats.flatMap((chat) =>
            chat.participants.map((participant) => participant.id)
          );
          return !participantIds.includes(u.id);
        });

        setUsers(filteredUsers);
      })
      .catch((error) => {
        setOpen(true);
        setMessage(error.message);
      });
  }

  return (
    <>
      <Grid container columns={18} sx={{ height: "100vh" }}>
        <Grid item xs={5}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              <AlertTitle>Error</AlertTitle>
              {message}
            </Alert>
          </Snackbar>
          <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <AppBar position="relative">
              <Toolbar
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <ChatIcon sx={{ mr: 2 }} />
                  <Typography variant="h6" color="inherit" noWrap>
                    FlashTalk
                  </Typography>
                </Box>
                <Tooltip
                  TransitionComponent={Zoom}
                  title={
                    <>
                      <Typography color="inherit">
                        User Id: {user?.id}
                      </Typography>
                      <Typography color="inherit">
                        Name: {user?.name}
                      </Typography>
                      <Typography color="inherit">
                        Email: {user?.email}
                      </Typography>
                    </>
                  }
                >
                  <Avatar>{user?.name[0]}</Avatar>
                </Tooltip>
              </Toolbar>
            </AppBar>
          </ThemeProvider>
          <List
            sx={{
              width: "100%",
              bgcolor: "#f5f5f5",
              height: "calc(100vh - 65px)",
              padding: 0,
            }}
          >
            <TextField
              size="small"
              id="standard-basic"
              label="Search for contact"
              variant="filled"
              fullWidth
              onKeyUp={(e) => {
                handleContactSearch(e);
              }}
            />
            {filteredChats.length === 0 && !users && (
              <Typography
                textAlign={"center"}
                marginTop={"20px"}
                color={"#a9a9a9"}
              >
                Search for a contact to start
              </Typography>
            )}
            {filteredChats &&
              [...filteredChats]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((chat) => (
                  <ChannelItem
                    key={chat.id}
                    chat={chat}
                    handleChannelItemClick={handleChannelItemClick}
                    userId={user?.id ?? ""}
                  />
                ))}
            {users && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#e8e8e8",
                  }}
                >
                  Users
                </Box>
                {users.map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    userId={user?.id ?? ""}
                    handleUserItemClick={handleUserItemClick}
                  />
                ))}
              </>
            )}
          </List>
        </Grid>
        <Grid item xs={13}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            {!channelSelected && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "rgba(0, 0, 0, 0.5)",
                }}
              >
                Select a conversation to start.
              </Typography>
            )}
            {channelSelected && user?.id && (
              <Channel
                chat={channelSelected}
                userId={user.id}
                handleErrorAlert={handleErrorAlert}
                updateMessages={updateMessages}
                token={token}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
