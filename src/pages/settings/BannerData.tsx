import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import { readBanners } from "../../features/bannerSlice";
import BannerDataCard from "../../components/BannerDataCard";

export default function BannerData() {
  const { banners, loading } = useAppSelector((state) => state.banner);
  const [rows, setRows] = React.useState<IBanner[]>(banners);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readBanners());
  }, [dispatch]);

  useEffect(() => {
    setRows(banners);
  }, [banners]);

  const handleAddBannerData = () => {
    const tempId = Date.now().toString();
    const newRow = {
      _id: tempId,
      label: "",
      description: "",
      image_url: "",
      link: "",
      isNew: true,
    };
    setRows([...rows, newRow]);
  };

  return (
    <div>
      {loading && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAddBannerData}
        sx={{
          backgroundColor: "#126E82",
          color: "white",
          position: "relative",
          top: 5,
          "&:hover": { backgroundColor: "#187e95" },
        }}
      >
        Add New Banner
      </Button>
      <Divider sx={{ mb: 2 }}>
        <Typography variant="h5" textAlign={"center"}>
          Banner Data
        </Typography>
      </Divider>

      <Grid container spacing={2}>
        {rows.length > 0 ? (
          rows.map((item, index) => (
            <Grid item key={index}>
              <BannerDataCard {...{ item, setRows }} />
            </Grid>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            No banner data...{" "}
          </Box>
        )}
      </Grid>
    </div>
  );
}
