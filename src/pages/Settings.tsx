import React from "react";
import { Paper, Typography } from "@mui/material";

const Settings = () => {
  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        Product Settings:
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Welcome to the Settings menu, where you can customize the layout and
        appearance of the main application. Take control of your inventory
        management experience by adjusting the following settings:
      </Typography>
      <Typography variant="h6" gutterBottom>
        Key Features:
      </Typography>
      <Typography variant="subtitle1" gutterBottom></Typography>
      <Typography variant="subtitle1" gutterBottom>
        Banner Configuration: Modify the main application banner to reflect your
        branding or personal style. Upload a custom image or choose from our
        predefined options.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Menu Structure: Tailor the menu layout to suit your workflow. Organize
        and prioritize menu items for quick and efficient navigation.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Layout Preferences: Adjust the overall layout of the application. Choose
        between different display options and set up your workspace for optimal
        productivity.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Usage:
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Feel free to explore and make adjustments according to your preferences.
        Your customized settings will enhance your user experience and
        streamline your inventory management tasks.
      </Typography>
    </Paper>
  );
};

export default Settings;
