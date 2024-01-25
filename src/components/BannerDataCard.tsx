import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createBanner, deleteBanner } from "../features/bannerSlice";
import { toastifyError, toastifySuccess } from "../helpers/toastify";
import uploadToCloudinary from "../helpers/uploadToCloudinary";
import sliderecord from "../assets/sliderecord.png";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import ConfirmDeletion from "./ConfirmDeletion";

interface IBannerDataCardProps {
  item: IBanner;
  setRows: React.Dispatch<React.SetStateAction<IBanner[]>>;
}
const BannerDataCard: React.FC<IBannerDataCardProps> = ({ item, setRows }) => {
  const { loading } = useAppSelector((state) => state.banner);

  const [formValue, setFormValue] = React.useState<INewBanner>({
    label: "",
    description: "",
    image_url: "",
    link: "",
  });
  const [confirmDelete, setConfirmDelete] = React.useState<IConfirmDelete>({
    open: false,
    isDelete: false,
    model: "banner data",
    id: null,
  });

  const dispatch = useAppDispatch();
  const imageURL = `${process.env.REACT_APP_CLOUDINARY_BASE_URL}`;
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleCancel = () => {
    setRows((rows) => rows.filter((row) => row._id !== item._id));
  };

  React.useEffect(() => {
    const deleteRow = async () => {
      if (confirmDelete.isDelete) {
        const response = await dispatch(deleteBanner(item._id as string));
        if (response.meta.requestStatus === "fulfilled") {
          setRows((rows) => rows.filter((row) => row._id !== item._id));
          toastifySuccess("Banner data successfully deleted.");
        } else if (response.meta.requestStatus === "rejected") {
          toastifyError("Network Error. Banner data cannot be deleted...");
        } else {
          toastifyError(
            "An unexpected error happened. Please, try again later..."
          );
        }
        setConfirmDelete({ ...confirmDelete, isDelete: false, open: false });
      }
    };
    deleteRow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmDelete.isDelete]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await dispatch(createBanner(formValue));
    if (data.meta.requestStatus === "fulfilled" && data.payload) {
      setRows((rows) =>
        rows.map((row) => {
          return row._id === item._id ? (data.payload as IBanner) : row;
        })
      );
    } else {
      toastifyError(
        "Error: Banner data cannot be created. Please check your network connection."
      );
    }
  };
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const link = await uploadToCloudinary(files[0]);
      if (link.name === "AxiosError") {
        toastifyError(
          "Error: CDN link cannot be created. Check your network connection."
        );
      } else {
        setFormValue({ ...formValue, image_url: link });
      }
    }
  };

  return (
    <>
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
      <Box>
        <ConfirmDeletion {...{ confirmDelete, setConfirmDelete }} />
        <Card sx={{ width: { xs: 255, sm: 380, md: 400 }, height: 450 }}>
          <Box position="relative">
            <CardMedia
              component="img"
              height={item.isNew ? 160 : 270}
              image={item.isNew ? sliderecord : imageURL + item.image_url}
              alt="bannerImage"
              sx={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                justifyContent: "space-between",
                top: "50%",
                width: "100%",
              }}
            >
              <NavigateBeforeIcon sx={{ color: "#ffffffb3" }} />
              <NavigateNextIcon sx={{ color: "#ffffffb3" }} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                textAlign: "center",
                top: "80%",
                width: "100%",
                color: "white",
              }}
            >
              <Typography variant="body2" fontSize={10}>
                {item.label}
              </Typography>
              <Typography variant="body2" fontSize={10}>
                {item.description}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: "90%",
                width: "100%",
                textAlign: "center",
              }}
            >
              <RemoveIcon sx={{ color: "#ffffffb3" }} />
              <RemoveIcon sx={{ color: "#ffffffb3" }} />
              <RemoveIcon sx={{ color: "#ffffffb3" }} />
            </Box>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <CardContent>
              {item.isNew ? (
                <Grid container flexDirection="column" spacing={1}>
                  <Grid item>
                    <TextField
                      id="standard-basic"
                      label="Label..."
                      variant="standard"
                      value={formValue.label}
                      required
                      onChange={(e) =>
                        setFormValue({ ...formValue, label: e.target.value })
                      }
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="standard-basic"
                      label="Description..."
                      variant="standard"
                      value={formValue.description}
                      required
                      onChange={(e) =>
                        setFormValue({
                          ...formValue,
                          description: e.target.value,
                        })
                      }
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="standard-basic"
                      label="Link..."
                      variant="standard"
                      value={formValue.link}
                      required
                      onChange={(e) =>
                        setFormValue({ ...formValue, link: e.target.value })
                      }
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="standard-basic"
                      label="Image URL..."
                      variant="standard"
                      value={formValue.image_url}
                      required
                      onChange={(e) =>
                        setFormValue({
                          ...formValue,
                          image_url: e.target.value,
                        })
                      }
                      size="small"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ mx: 0 }}>
                            <Tooltip title="Select an image file to create CDN">
                              <Button
                                component="label"
                                variant="text"
                                size="large"
                                startIcon={
                                  <FolderIcon sx={{ color: "#f0d171" }} />
                                }
                                sx={{
                                  mb: 2,
                                  py: 0.5,
                                }}
                              >
                                <VisuallyHiddenInput
                                  type="file"
                                  accept="image/*"
                                  onChange={handleChange}
                                />
                              </Button>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Tooltip title={item.label.length > 52 ? item.label : ""}>
                    <Typography variant="subtitle1" noWrap>
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bolder" }}
                      >
                        Label:
                      </Typography>
                      {item.label}
                    </Typography>
                  </Tooltip>
                  <Tooltip
                    title={item.description.length > 52 ? item.description : ""}
                  >
                    <Typography variant="subtitle1" noWrap>
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bolder" }}
                      >
                        Description:
                      </Typography>
                      {item.description}
                    </Typography>
                  </Tooltip>
                  <Tooltip title={item.link.length > 52 ? item.link : ""}>
                    <Typography variant="subtitle1" noWrap>
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bolder" }}
                      >
                        Link:
                      </Typography>
                      {item.link}
                    </Typography>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
            <CardActions>
              {item.isNew ? (
                <Box
                  display="flex"
                  justifyContent="right"
                  width="100%"
                  gap={2}
                  px={2}
                >
                  <Button
                    type="submit"
                    size="small"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="right"
                  width="100%"
                  gap={2}
                  px={2}
                  pt={1}
                >
                  <Button size="small" color="primary" startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      setConfirmDelete({ ...confirmDelete, open: true })
                    }
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </CardActions>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default BannerDataCard;
