import { createTheme } from "@mui/material/styles";
import { fontSize16 } from "./components/utils/FontSize";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#09378dff", // Bright cyan for a futuristic glow
    },
    secondary: {
      main: "#ff4081", // Vibrant pink for accents
    },
    text: {
      primary: "#131313ff",
      secondary: "#2e2e2eff",
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
      fontSize: fontSize16,
      color: "#09378dff",
    },
    h3: {
      fontSize: fontSize16,
      color: "#09378dff",
    },
    h4: {
      fontSize: fontSize16,
      color: "#09378dff",
    },
    h5: {
      fontSize: fontSize16,
      color: "#09378dff",
    },
    h6: {
      fontSize: fontSize16,
      color: "#09378dff",
    },
    body1: {
      color: "#0e0d0dff",
    },
  },
});
