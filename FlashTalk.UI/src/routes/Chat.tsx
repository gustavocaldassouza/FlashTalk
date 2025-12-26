import { useLocation, useNavigate } from "react-router-dom";
import React, { MouseEvent, useEffect, useState, useRef } from "react";
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
  IconButton,
  List,
  Menu,
  MenuItem,
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
import { useSignalR } from "../hooks/useSignalR";
import { ChatMessage } from "../services/signalRService";

const defaultTheme = createTheme();
const settings = ["Logout"];

export default function Chat() {
  const [user, setUser] = useState<User>();
  const [newChatId, setNewChatId] = useState<string>("0");
  const [open, setOpen] = useState(false);
  const [channelSelected, setChannelSelected] = useState<ChatModel>();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatModel[]>([]);
  const [users, setUsers] = useState<User[]>();
  const [token, setToken] = useState<string>("");
  const [contactSearch, setContactSearch] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const channelSelectedRef = useRef<ChatModel | undefined>(channelSelected);
  const currentChatIdRef = useRef<number | null>(null);

  // Update ref when channelSelected changes
  useEffect(() => {
    channelSelectedRef.current = channelSelected;
    currentChatIdRef.current = channelSelected ? parseInt(channelSelected.id) : null;
  }, [channelSelected]);

  // SignalR hook - manage all SignalR functionality here
  const {
    isConnected,
    isConnecting,
    error: signalRError,
    connect,
    joinChat,
    leaveChat,
    sendMessage: sendSignalRMessage,
    onMessageReceived,
    onUserOnline,
    onUserOffline,
    onUserStartedTyping,
    onUserStoppedTyping,
    startTyping,
    stopTyping,
  } = useSignalR({
    baseUrl: 'http://localhost:5175',
    token: token,
    autoConnect: false
  });

  function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu(option: string) {
    if (option === "Logout") {
      navigate("/");
    }
    setAnchorElUser(null);
  }

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }
    if (location.state.token) {
      setToken(location.state.token);
      handleGetUserInfo(location.state.token);
      handleGetMessages(location.state.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.token]); // Only re-run the effect if token changes

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetMessages(token);

      if (channelSelected && channelSelected.id !== "0") {
        setChannelSelected(
          chats.find((chat) => chat.id === channelSelected.id) as ChatModel
        );
      }
    }, 4000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelSelected, chats, token]);

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
    setChannelSelected(
      chats.find((chat) => chat.id === newChatId) as ChatModel
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChatId]);

  // Setup SignalR event listeners FIRST (before connecting)
  useEffect(() => {
    if (!token) return;

    console.log('Setting up SignalR event listeners...');

    // Handle incoming messages
    onMessageReceived((receivedMessage: ChatMessage) => {
      console.log('Message received via SignalR:', receivedMessage);

      // Create a new message object
      const newMessage: MessageModel = {
        id: Date.now().toString(), // Temporary ID
        text: receivedMessage.message,
        createdAt: new Date(receivedMessage.timestamp),
        sender: {
          id: receivedMessage.senderId.toString(),
          name: receivedMessage.senderName,
          email: '',
          password: '',
          color: '#000000'
        },
        isRead: false
      };

      // Update the chat with the new message
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat => {
          if (parseInt(chat.id) === receivedMessage.chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage]
            };
          }
          return chat;
        });
        return updatedChats;
      });

      // Update the selected channel if it matches
      if (channelSelectedRef.current && parseInt(channelSelectedRef.current.id) === receivedMessage.chatId) {
        setChannelSelected(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : prev);
      }
    });

    // Handle user online status
    onUserOnline((userStatus: { userId: number; userName: string }) => {
      console.log('User came online:', userStatus);
      setOnlineUsers(prev => new Set(prev).add(userStatus.userId));
    });

    // Handle user offline status
    onUserOffline((userStatus: { userId: number; userName: string }) => {
      console.log('User went offline:', userStatus);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userStatus.userId);
        return newSet;
      });
    });

    // Handle typing started
    onUserStartedTyping((typingUser: { chatId: number; userId: number; userName: string }) => {
      console.log('User started typing:', typingUser);
      if (currentChatIdRef.current === typingUser.chatId) {
        setTypingUsers(prev => new Set(prev).add(typingUser.userId));
      }
    });

    // Handle typing stopped
    onUserStoppedTyping((typingUser: { chatId: number; userId: number; userName: string }) => {
      console.log('User stopped typing:', typingUser);
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(typingUser.userId);
        return newSet;
      });
    });

    console.log('Event listeners registered, now connecting...');
  }, [token, onMessageReceived, onUserOnline, onUserOffline, onUserStartedTyping, onUserStoppedTyping]);

  // Connect to SignalR AFTER event listeners are set up
  useEffect(() => {
    if (token && !isConnected && !isConnecting) {
      console.log('Connecting to SignalR...');
      connect();
    }
  }, [token, isConnected, isConnecting, connect]);

  // Join/leave chat rooms when channel selection changes
  useEffect(() => {
    if (isConnected && channelSelected && channelSelected.id !== "0") {
      const chatId = parseInt(channelSelected.id);
      console.log(`Joining chat ${chatId}`);
      joinChat(chatId).catch((err: Error) => {
        console.error('Failed to join chat:', err);
      });

      // Cleanup: leave chat when switching to another
      return () => {
        console.log(`Leaving chat ${chatId}`);
        leaveChat(chatId).catch((err: Error) => {
          console.error('Failed to leave chat:', err);
        });
      };
    }
  }, [isConnected, channelSelected, joinChat, leaveChat]);

  // Display SignalR errors
  useEffect(() => {
    if (signalRError) {
      handleErrorAlert(`SignalR Error: ${signalRError}`);
    }
  }, [signalRError]);

  function handleGetMessages(tokenJWT?: string | undefined) {
    getMessages(tokenJWT ?? token)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        filterChatsByContactSearch(data);
        setChats(data);
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
      id: "0",
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

  function updateMessages(
    chatId: string,
    messages: MessageModel[],
    newChat?: ChatModel
  ) {
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, messages: messages };
      }
      return chat;
    });

    if (newChat && messages.length > 0) {
      updatedChats.push(newChat);
      setUsers(
        users?.filter(
          (u) => u.id !== newChat.participants.find((p) => p.id != user?.id)?.id
        )
      );
    }

    setChats(updatedChats);
    if (newChat) {
      setNewChatId(newChat.id);
    }

    filterChatsByContactSearch(updatedChats);
  }

  function handleContactSearch() {
    if (contactSearch === "") {
      setFilteredChats(chats);
      setUsers(undefined);
      handleGetMessages();
      return;
    }

    filterChatsByContactSearch(chats);
    handleGetUsers(contactSearch.toLowerCase());
  }

  function filterChatsByContactSearch(updatedChats: ChatModel[]) {
    const filteredChats = updatedChats.filter((chat) =>
      chat.participants
        .find((p) => p.id != user?.id)
        ?.name?.toLowerCase()
        .includes(contactSearch.toLowerCase())
    );
    setFilteredChats(filteredChats);
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
                <Tooltip TransitionComponent={Zoom} title={"Open Settings"}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ backgroundColor: user?.color }}>
                      {user?.name[0]}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleCloseUserMenu(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Toolbar>
            </AppBar>
          </ThemeProvider>
          <List
            sx={{
              width: "100%",
              bgcolor: "#f5f5f5",
              height: "calc(100vh - 65px)",
              padding: 0,
              overflow: "auto",
            }}
          >
            <TextField
              size="small"
              id="standard-basic"
              label="Search for contact"
              variant="filled"
              fullWidth
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              onKeyUp={handleContactSearch}
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
                .map((chat) => {
                  const otherParticipant = chat.participants.find((p) => p.id !== user?.id);
                  const isOnline = otherParticipant ? onlineUsers.has(parseInt(otherParticipant.id)) : false;

                  return (
                    <ChannelItem
                      key={chat.id}
                      chat={chat}
                      handleChannelItemClick={handleChannelItemClick}
                      userId={user?.id ?? ""}
                      isOnline={isOnline}
                    />
                  );
                })}
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
                userName={user.name}
                handleErrorAlert={handleErrorAlert}
                updateMessages={updateMessages}
                token={token}
                onSendMessage={sendSignalRMessage}
                onStartTyping={startTyping}
                onStopTyping={stopTyping}
                typingUsers={typingUsers}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
