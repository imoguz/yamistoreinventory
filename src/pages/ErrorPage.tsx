import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

interface IError {
  error: string;
}
const ErrorPage: React.FC<IError> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        px={1}
        py={0.5}
        bgcolor="#dc3030"
      >
        <ErrorOutlineIcon sx={{ color: "white" }} />
        <Typography color="white" id="modal-modal-title" variant="subtitle1">
          Error
        </Typography>
      </Box>
      <Typography id="modal-modal-description" sx={{ mt: 2, px: 2 }}>
        {error}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-around", my: 3 }}>
        <Button
          variant="outlined"
          sx={{ width: 150 }}
          startIcon={<ReplyIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          sx={{ width: 150, color: "green" }}
          endIcon={<HomeIcon />}
          onClick={() => navigate(`/`)}
        >
          Main Page
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
