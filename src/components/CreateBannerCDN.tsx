import React, { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../helpers/styles";
import uploadToCloudinary from "../helpers/uploadToCloudinary";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider, Grid, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #00909e",
  borderRadius: 1,
  boxShadow: 24,
};

interface ICreateCDNProps {
  openCDN: boolean;
  setOpenCDN: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: INewVariantForm;
  setFormValues: React.Dispatch<React.SetStateAction<INewVariantForm>>;
}

const CreateCDN: React.FC<ICreateCDNProps> = ({
  openCDN,
  setOpenCDN,
  formValues,
  setFormValues,
}) => {
  const handleClose = () => setOpenCDN(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [CDNLink, setCDNLink] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleCreateCDN = async () => {
    const link = await uploadToCloudinary(selectedFile);
    if (link.name === "AxiosError") {
      setCDNLink(
        "Error: CDN link cannot be created. Check your network connection."
      );
    } else {
      setCDNLink(link);
    }
  };

  const handleAddLink = () => {
    CDNLink && setFormValues({ ...formValues, image_url: CDNLink });
    setCDNLink(null);
    setSelectedFile(null);
    handleClose();
  };

  return (
    <Modal
      open={openCDN}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          sx={{ bgcolor: "#00909e", px: 1, py: 0.3 }}
        >
          <Typography variant="body1" sx={{ color: "white" }}>
            Creating CDN Link
          </Typography>

          <CloseIcon
            sx={{
              cursor: "pointer",
              color: "#004b52",
              "&:hover": { color: "#001b1e" },
            }}
            onClick={handleClose}
          />
        </Box>

        <Card sx={{ maxWidth: 400, boxShadow: 0, p: 2 }}>
          <Grid container spacing={1} alignItems={"center"}>
            <Grid item xs={4}>
              <Button
                component="label"
                size="small"
                endIcon={<CloudUploadIcon />}
                variant="text"
                sx={{ color: "#00909e", py: 0.8 }}
              >
                Image File
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  width: "100%",
                  height: 50,
                  bgcolor: "#00919e1e",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  px: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" fontSize={13}>
                  {selectedFile
                    ? selectedFile.name.slice(0, 70)
                    : "No file chosen..."}
                  {selectedFile && selectedFile.name.length > 69 && "..."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Divider />
              <Button
                component="label"
                size="small"
                disabled
                variant="text"
                sx={{ color: "#00909e !important", py: 0.8 }}
              >
                Image Preview
              </Button>
            </Grid>
            <Grid item xs={8}>
              {selectedFile ? (
                <CardMedia
                  sx={{ height: 120 }}
                  component="img"
                  alt="uploadedimage"
                  image={URL.createObjectURL(selectedFile)}
                />
              ) : (
                <Skeleton
                  sx={{ height: 130 }}
                  animation="wave"
                  variant="rectangular"
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems={"center"}>
            <Grid item xs={4}>
              <Divider sx={{ position: "relative", top: -7 }} />

              <Button
                component="label"
                size="small"
                variant="text"
                sx={{ color: "#00909e", py: 0.8 }}
                onClick={handleCreateCDN}
              >
                Create CDN
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  width: "100%",
                  height: 50,
                  bgcolor: "#00919e1e",
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  px: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" fontSize={13}>
                  {CDNLink && CDNLink.slice(0, 5) !== "Error"
                    ? CDNLink
                    : "Click button to create CDN link."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <CardActions sx={{ justifyContent: "center", mt: 1 }}>
            <Button
              color="error"
              variant="outlined"
              size="small"
              fullWidth
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              color="success"
              variant="outlined"
              size="small"
              fullWidth
              disabled={!CDNLink || CDNLink.slice(0, 5) === "Error"}
              onClick={handleAddLink}
            >
              Add CDN Link
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};

export default CreateCDN;
