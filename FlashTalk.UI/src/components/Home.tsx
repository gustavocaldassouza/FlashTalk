import AppBar from "@mui/material/AppBar";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ChatIcon from "@mui/icons-material/Chat";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";

const defaultTheme = createTheme();

export default function Home() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar className={styles.toolbar}>
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
                style={{ color: "white", borderColor: "white" }}
                variant="outlined"
                endIcon={<SendIcon />}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
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
