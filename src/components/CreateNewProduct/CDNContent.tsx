import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../../helpers/styles";
import uploadToCloudinary from "../../helpers/uploadToCloudinary";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardMedia, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { toastifyError } from "../../helpers/toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface ICDNContentProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: INewProduct;
  setFormValues: React.Dispatch<React.SetStateAction<INewProduct>>;
}

const CDNContent: React.FC<ICDNContentProps> = ({
  setOpenModal,
  formValues,
  setFormValues,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [CDNImageLinks, setCDNImageLinks] = useState<IImage[]>([]);
  const [newIndex, setNewIndex] = React.useState<number | null>(null);

  const imageURL = `${process.env.REACT_APP_CLOUDINARY_BASE_URL}`;

  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (formValues.images.length > 0) {
      setCDNImageLinks([...formValues.images]);
    } else setCDNImageLinks([]);
  }, [formValues]);

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      setCDNImageLinks([
        ...CDNImageLinks,
        { url: link, isMainImage: CDNImageLinks.length > 1 ? false : true },
      ]);
      setSelectedFile(null);
    }
  };

  const handleAddLink = () => {
    setFormValues({ ...formValues, images: CDNImageLinks });
    setSelectedFile(null);
    handleClose();
  };

  const handleClickDeleteIcon = (deleteIndex: number) => {
    const updatedList = CDNImageLinks.filter(
      (_, index) => index !== deleteIndex
    );
    setCDNImageLinks([
      ...updatedList.map((item, i) =>
        i < 2 ? { ...item, isMainImage: true } : { ...item, isMainImage: false }
      ),
    ]);
  };

  // const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, index: number) => {
  //   if (index < 0 || index > CDNImageLinks.length - 1 || index === newIndex) {
  //     // Index out of bounds or unchanged, do nothing
  //     return;
  //   }
  //   if (newIndex !== null) {
  //     let selectedItem: IImage = CDNImageLinks[index];
  //     let newOrder: IImage[] = CDNImageLinks.filter((_, i) => i !== index);
  //     newOrder.splice(newIndex, 0, selectedItem);
  //     setCDNImageLinks([
  //       ...newOrder.map((item, i) =>
  //         i < 2
  //           ? { ...item, isMainImage: true }
  //           : { ...item, isMainImage: false }
  //       ),
  //     ]);
  //   }
  // };
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const newData = [...CDNImageLinks];
    const [draggedItem] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, draggedItem);
    setCDNImageLinks(newData);
  };

  return (
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
            onChange={handleImageFileChange}
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
      <Divider sx={{ color: "#675858" }}>CDN Image Links</Divider>

      {!CDNImageLinks.length ? (
        <Typography color={"gray"} variant="body2" fontSize={15}>
          No image link created...
        </Typography>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <Grid
                container
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  bgcolor: "background.paper",
                  flexDirection: "column",
                }}
              >
                {CDNImageLinks.map((image, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Grid
                        item
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        sx={{
                          width: 345,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 0.5,
                          "&:hover": {
                            boxShadow: 3,
                            "&  .delete-box": { display: "block" },
                            "&  .url-box": { width: 245 },
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: 25,
                              color: "gray",
                            }}
                          >
                            <DragIndicatorIcon />
                          </Box>
                          <Box
                            className="image-box"
                            width={35}
                            height={33}
                            position="relative"
                          >
                            <CardMedia
                              component="img"
                              alt="ProductImage"
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              image={imageURL + image.url}
                            />
                            {image.isMainImage && (
                              <Typography
                                sx={{
                                  position: "absolute",
                                  textAlign: "center",
                                  bottom: 0,
                                  fontSize: 8,
                                  color: "#230000a4",
                                }}
                              >
                                {`main image-${index + 1}`}
                              </Typography>
                            )}
                          </Box>
                          <Box className="url-box" width={275}>
                            <Typography variant="body1" fontSize={14} noWrap>
                              {image.url}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          className="delete-box"
                          sx={{
                            width: 35,
                            textAlign: "center",
                            display: "none",
                          }}
                        >
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => handleClickDeleteIcon(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      )}

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
          // disabled={!CDNImageLinks || CDNImageLinks.slice(0, 5) === "Error"}
          onClick={handleAddLink}
        >
          Add Image Links
        </Button>
      </CardActions>
    </Card>
  );
};

export default CDNContent;
