import { ThemeProvider } from "@emotion/react";
import { Notes } from "./components/notes/Notes";
import "./styles/App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";
import { Todos } from "./components/todos/Todos";
import { Container, Typography } from "@mui/material";
import { text } from "./localization/eng";
import { fontSize16 } from "./components/utils/FontSize";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#09378dff", // Bright cyan for a futuristic glow
    },
    secondary: {
      main: "#ff4081", // Vibrant pink for accents
    },
    background: {
      default: "#0a0a0a", // Deep black for space-like feel
      paper: "#1a1a1a", // Slightly lighter for cards/modals
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
    error: {
      main: "#862a2aff",
    },
    warning: {
      main: "#ffb74d",
    },
    info: {
      main: "#64b5f6",
    },
    success: {
      main: "#81c784",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#09378dff",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#ffffff",
    },
    body1: {
      color: "#b3b3b3",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0, 229, 255, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0, 229, 255, 0.5)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#1a1a1a",
            "& fieldset": {
              borderColor: "#333",
            },
            "&:hover fieldset": {
              borderColor: "#00e5ff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00e5ff",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <Container sx={{ px: 2 }}>
        <Typography variant="h1" fontSize={fontSize16} fontWeight="bold">
          {text.appName}
        </Typography>
      </Container>
      <Todos />
    </Container>
  </ThemeProvider>
);

export default App;
