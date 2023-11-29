import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import ChatIcon from "@mui/icons-material/Chat";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";

const defaultTheme = createTheme();

export default function Home() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ChatIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              FlashTalk
            </Typography>
          </div>
          <div>
            <Link style={{ textDecoration: "none" }} to="/signin">
              <Button
                style={{ color: "white", marginRight: 10 }}
                variant="text"
              >
                Sign In
              </Button>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/signup">
              <Button
                variant="outlined"
                style={{ borderColor: "white", color: "white" }}
                endIcon={<SendIcon />}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Speed, Style, and simplicity.
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Welcome to FlashTalk, the messaging app that brings speed, style,
              and simplicity to your communication experience. Say goodbye to
              delays and hello to instant connections with our lightning-fast
              messaging platform.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <TextField
                margin="normal"
                required
                size="small"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Link to="/signup">
                <Button
                  style={{ marginTop: 2 }}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Sign Up
                </Button>
              </Link>
            </Stack>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}
