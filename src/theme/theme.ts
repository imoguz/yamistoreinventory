import { createTheme } from "@mui/material/styles";

const appBarColor = "#00909E";
const drawerColor = "#142850";

const darkMode = false;

const theme = createTheme({
  palette: {
    mode: darkMode ? "dark" : "light",
    background: {
      default: darkMode ? "#282c34" : "#FFFFFF",
      // paper: backgroundColor,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: drawerColor,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: appBarColor,
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 992,
      xl: 1280,
    },
  },
});

export default theme;
