import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../helpers/styles";
import uploadToCloudinary from "../helpers/uploadToCloudinary";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider, Grid, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { toastifyError } from "../helpers/toastify";

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

interface ICreateMultiCDNProps {
  openModal: IOpenModalState;
  setOpenModal: React.Dispatch<React.SetStateAction<IOpenModalState>>;
  formValues: INewProduct;
  setFormValues: React.Dispatch<React.SetStateAction<INewProduct>>;
}

const CreateMultiCDN: React.FC<ICreateMultiCDNProps> = ({
  openModal,
  setOpenModal,
  formValues,
  setFormValues,
}) => {
  const handleClose = () => setOpenModal({ ...openModal, cdn: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [CDNLinks, setCDNLinks] = useState<string[]>([]);

  const [mainImage, setMainImage] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState<number[]>([]);

  useEffect(() => {
    if (formValues.images.length > 0) {
      const currentImage = formValues.images.map((item, index) => {
        item.isMainImage === true && setMainImage(index);
        return item.url;
      });
      setCDNLinks(currentImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  console.log(CDNLinks);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleCreateCDN = async () => {
    const link = await uploadToCloudinary(selectedFile);
    if (link.name === "AxiosError") {
      toastifyError(
        "Error: CDN link cannot be created. Check your network connection."
      );
    } else {
      setCDNLinks([...CDNLinks, link]);
      setSelectedFile(null);
    }
  };

  const handleAddLink = () => {
    const images = checked?.map((index) => {
      return {
        url: CDNLinks[index],
        isMainImage: mainImage === index ? true : false,
      };
    });

    if (images.length > 0 && mainImage === null) {
      images[0].isMainImage = true;
    }

    setFormValues({ ...formValues, images: images });
    setSelectedFile(null);
    handleClose();
  };

  return (
    <Modal
      open={openModal.cdn}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "2px solid #e0e0e0",
              borderRadius: 1.2,
              width: 350,
              pl: 1,
              mx: "auto",
            }}
          >
            <Typography color={"gray"} variant="body2" fontSize={15}>
              {selectedFile
                ? selectedFile.name.slice(0, 32).trim()
                : "No file chosen..."}
              {selectedFile && selectedFile.name.length > 31 && "..."}
            </Typography>
            <Button
              component="label"
              endIcon={<CloudUploadIcon />}
              variant="contained"
              color="info"
              sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
            >
              File
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </Button>
          </Box>
          <Grid textAlign={"center"} my={2}>
            <Button
              component="label"
              disabled={Boolean(!selectedFile)}
              variant="contained"
              endIcon={<AddLinkIcon />}
              onClick={handleCreateCDN}
              sx={{
                backgroundColor: "#126E82",
                "&:hover": { backgroundColor: "#187e95" },
              }}
            >
              Create CDN
            </Button>
          </Grid>
          <Divider sx={{ color: "#675858" }}>CDN Links</Divider>
          <List
            dense
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {!CDNLinks.length && (
              <Typography color={"gray"} variant="body2" fontSize={15}>
                No CDN link created...
              </Typography>
            )}
            {CDNLinks.map((value, index) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem
                  key={value}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(index)}
                      checked={checked.indexOf(index) !== -1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar alt="X" src={value} />
                    </ListItemAvatar>
                    <Tooltip
                      title="Click to set main image."
                      placement="top-end"
                    >
                      <ListItemText
                        sx={{ color: index === mainImage ? "darkred" : "" }}
                        id={labelId}
                        primary={value}
                        onClick={() => setMainImage(index)}
                      />
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

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
              // disabled={!CDNLinks || CDNLinks.slice(0, 5) === "Error"}
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

export default CreateMultiCDN;
