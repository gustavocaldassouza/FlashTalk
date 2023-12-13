import ChatIcon from "@mui/icons-material/Chat";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  AlertColor,
  AlertTitle,
  AppBar,
  Button,
  Snackbar,
  Toolbar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { registerUser } from "../services/UserService";
import { User } from "../models/User";
import React from "react";

const defaultTheme = createTheme();

export default function SignUp() {
  // const { email } = useParams();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [emailField, setEmailField] = React.useState(useParams().email || "");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (
      data.get("password")?.toString() !==
      data.get("repeat-password")?.toString()
    ) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    setLoading(true);
    const user: User = {
      id: "0",
      email: data.get("email")?.toString() || "",
      password: data.get("password")?.toString() || "",
      name:
        data.get("firstName")?.toString() +
        " " +
        data.get("lastName")?.toString(),
      color:
        "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0"),
    };

    registerUser(user)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        setLoading(false);
        setEmailField("");
        setEmailError("");
        setAlertSeverity("success");
        setAlertTitle("Success");
        setMessage("User successfully created");
        setOpen(true);
      })
      .catch((error) => {
        error.text().then((message: string) => {
          setAlertSeverity("error");
          setAlertTitle("Error");
          setOpen(true);
          setMessage(`${message}`);
          setLoading(false);
        });
      });
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={(alertSeverity as AlertColor) || "error"}
          sx={{ width: "100%" }}
        >
          <AlertTitle>{alertTitle}</AlertTitle>
          <Typography>{message}</Typography>
          {alertSeverity === "success" && (
            <Button variant="outlined" onClick={() => navigate("/signin")}>
              Go to Sign In
            </Button>
          )}
        </Alert>
      </Snackbar>
      <AppBar position="relative">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ChatIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              FlashTalk
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={emailField}
                    onChange={(e) => setEmailField(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="repeat-password"
                  label="Repeat Password"
                  type="password"
                  id="repeat-password"
                  autoComplete="repeat-password"
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
