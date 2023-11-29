import { useParams } from "react-router-dom";
import MessageReceivingService from "../services/MessageReceivingService";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Chat as ChatModel } from "../models/Chat";

function Chat() {
  const { userid } = useParams();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resp, setResp] = useState<ChatModel[]>();

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
          return response.json(); // Convert the response to JSON
        })
        .then((data) => {
          setResp(data);
        })
        .catch((error) => {
          setOpen(true);
          setMessage(error.message);
        });
    }
    handleGetMessages();
  }, [userid]);

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      </Snackbar>
      <h1>User ID: {userid}</h1>
      <p>Hi</p>
      {resp &&
        resp.map((chat) => (
          <div key={chat.id}>
            <p>{chat.id}</p>
          </div>
        ))}
    </>
  );
}

export default Chat;
