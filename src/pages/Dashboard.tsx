import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { DrawerHeader, AppBar, Drawer } from "../helpers/drawerConfig";
import { menuItems } from "../helpers/menuitems";
import yamilogo from "../assets/yamilogo.png";
import { Outlet, useNavigate } from "react-router-dom";
import SubMenu from "../components/SubMenu";
import { Grid } from "@mui/material";
import { useThemeContext } from "../context/themeContext";

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { drawerOpen, setDrawerOpen } = useThemeContext();
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const storedMenuItem = sessionStorage.getItem("selectedMenuItem");
    setSelectedMenuItem(storedMenuItem ? storedMenuItem : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false); // mobilde drawer kapalı
    } else {
      setDrawerOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const handleClickedMenuItem = (item: IMenuItem, index: number) => {
    setSelectedMenuItem(item.title);
    sessionStorage.removeItem("selectedSubMenuItem");
    sessionStorage.setItem("selectedMenuItem", item.title);
    navigate(item.path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <Grid container alignItems={"center"}>
            <Grid item xs={drawerOpen ? 0 : 1}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(drawerOpen && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1} textAlign={"center"}>
              <Typography variant="body1" className="logoShadow">
                Inventory
              </Typography>

              <Typography variant="body1" className="logoShadow">
                Management
              </Typography>
            </Grid>
            <Grid
              item
              xs={drawerOpen ? 10 : 9}
              height={63}
              display={"flex"}
              justifyContent={"center"}
            >
              {selectedMenuItem &&
              (selectedMenuItem === "Product Attributes" ||
                selectedMenuItem === "Settings & Layout") ? (
                <SubMenu {...{ selectedMenuItem }} />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={1}>
              <Avatar alt="AvatarName" src="/static/images/avatar/2.jpg" />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={drawerOpen}>
        <DrawerHeader>
          <Box
            component="img"
            sx={{
              opacity: 0.9,
              mx: "auto",
              borderRadius: 4,
              height: 25,
              "&:hover": { cursor: "pointer", opacity: 1 },
            }}
            src={yamilogo}
            alt="yami"
          />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon sx={{ color: "#3887BE" }} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "block",
                "&:hover": { bgcolor: "#27496D" },
              }}
              onClick={() => handleClickedMenuItem(item, index)}
              className={
                selectedMenuItem === item.title ? "listItemTextActive" : ""
              }
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : "auto",
                    justifyContent: "center",
                    color: selectedMenuItem === item.title ? "red" : "#DAE1E7",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    opacity: drawerOpen ? 1 : 0,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
