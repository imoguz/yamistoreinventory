import { Box, Button, ButtonGroup, Grid } from "@mui/material";
import { useState } from "react";
import { attributeMenuItems } from "../helpers/menuitems";
import { settingMenuItems } from "../helpers/menuitems";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../context/themeContext";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
interface ISubmenuProps {
  selectedMenuItem: string;
}
const SubMenu: React.FC<ISubmenuProps> = ({ selectedMenuItem }) => {
  const { drawerOpen } = useThemeContext();

  const [selectedSubmenuItem, setSelectedSubmenuItem] = useState<string | null>(
    sessionStorage.getItem("selectedSubMenuItem") || null
  );

  const navigate = useNavigate();
  const submenulist =
    selectedMenuItem === "Product Attributes"
      ? attributeMenuItems
      : settingMenuItems;
  const submenuPath =
    selectedMenuItem === "Product Attributes" ? "attributes/" : "settings/";

  const handleClick = (item: ISubMenuItem) => {
    setSelectedSubmenuItem(item.title);
    sessionStorage.setItem("selectedSubMenuItem", item.title.toString());
    navigate(submenuPath + item.title.toLowerCase());
  };

  const matches915 = useMediaQuery("(min-width:985px)");
  const matches730 = useMediaQuery("(min-width:800px)");
  const shouldDisplayContent =
    (matches915 && drawerOpen) || (matches730 && !drawerOpen);
  return (
    <>
      {shouldDisplayContent ? (
        <Box>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            {submenulist.map((item, index) => (
              <Box key={index}>
                <Button
                  key={index}
                  sx={{
                    bgcolor:
                      selectedSubmenuItem && selectedSubmenuItem === item.title
                        ? "#00707a"
                        : "#00909e",
                    boxShadow:
                      selectedSubmenuItem && selectedSubmenuItem === item.title
                        ? 0
                        : " #00000066 0px 3px 5px, #0000004c 0px 9px 16px -4px, #00000033 0px -4px 0px inset !important ",
                    color:
                      selectedSubmenuItem && selectedSubmenuItem === item.title
                        ? "#ffefef"
                        : "#DAE1E7",
                    fontSize: 13,
                    textTransform: "initial",
                    width: 70,
                    height: 62,
                    "&:hover": { bgcolor: "#007b86" },
                  }}
                  onClick={() => handleClick(item)}
                >
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid> {item.icon}</Grid>
                    <Grid> {item.title}</Grid>
                  </Grid>
                </Button>
              </Box>
            ))}
          </ButtonGroup>
        </Box>
      ) : (
        <Grid
          sx={{
            position: "absolute",
            right: 60,
          }}
        >
          <Box
            sx={{
              height: "100vh",
              transform: "translateZ(0px)",
              flexGrow: 1,
              "& .MuiSpeedDial-fab": {
                bgcolor: "#00909e",
                "&:hover": { bgcolor: "#126e82" },
              },
            }}
          >
            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{
                position: "fixed",
                bottom: 35,
              }}
              icon={<DesignServicesIcon />}
            >
              {submenulist.map((action) => (
                <SpeedDialAction
                  key={action.title}
                  icon={action.icon}
                  tooltipTitle={action.title}
                  onClick={() => handleClick(action)}
                />
              ))}
            </SpeedDial>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default SubMenu;
