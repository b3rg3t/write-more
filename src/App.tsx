import { ThemeProvider } from "@emotion/react";
import { Notes } from "./components/notes/Notes";
import "./styles/App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // primary: {
    //   // main: "#ff0000",
    // },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Notes />
  </ThemeProvider>
);

export default App;
