// App.tsx
import React from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import Router from "./router/Router";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastContainer } from "react-toastify";
import ThemeContextProvider from "./context/themeContext";
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ThemeContextProvider>
          <CssBaseline />
          <ToastContainer />
          <Router />
        </ThemeContextProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
