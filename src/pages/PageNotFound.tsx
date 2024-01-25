import { Box, Button, Grid } from "@mui/material";
import pageunderconstruction from "../assets/construction.jpg";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import pagenotfound from "../assets/pagenotfound.png";
import { useNavigate } from "react-router-dom";
const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Grid container height={"100vh"} border={1}>
      <Box
        component={"img"}
        src={pageunderconstruction}
        alt="Page Not Found"
        sx={{ objectFit: "cover", width: "100%", height: "100%", mx: "auto" }}
      />
      <Button
        sx={{ marginLeft: 15, position: "absolute", top: "80%" }}
        variant="text"
        size="large"
        color="info"
        startIcon={<ArrowBackIosIcon />}
        onClick={() => navigate(-1)}
      >
        Previous Page
      </Button>
    </Grid>
  );
};

export default PageNotFound;
