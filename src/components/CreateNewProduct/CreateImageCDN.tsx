import React, { ChangeEvent, useEffect, useState } from "react";
import { Modal, Tooltip, Grid, Card, CardActions, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../../helpers/styles";
import uploadToCloudinary from "../../helpers/uploadToCloudinary";
import { CardMedia, Box, Divider, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { toastifyError } from "../../helpers/toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 380,
  bgcolor: "background.paper",
  border: "1px solid #00909e",
  borderRadius: 1,
  boxShadow: 24,
  marginTop: "-200px",
  marginLeft: "-190px",
};

interface ICreateImageCDNProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: INewProduct;
  setFormValues: React.Dispatch<React.SetStateAction<INewProduct>>;
}

const CreateImageCDN: React.FC<ICreateImageCDNProps> = ({
  openModal,
  setOpenModal,
  formValues,
  setFormValues,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [CDNImageLinks, setCDNImageLinks] = useState<IImage[]>([]);
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

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = [...CDNImageLinks];
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, draggedItem);
    setCDNImageLinks([
      ...newOrder.map((item, i) =>
        i < 2 ? { ...item, isMainImage: true } : { ...item, isMainImage: false }
      ),
    ]);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
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
                        flexDirection: "row",
                        maxHeight: 200,
                        py: 1,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { width: 4 },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(0, 0, 0, 0.368)",
                          borderRadius: 5,
                        },
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
                                  "&  .url-box": { width: 240 },
                                },
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Tooltip
                                  title="Drag and drop to reorder"
                                  placement="top"
                                  arrow
                                >
                                  <Box
                                    {...provided.dragHandleProps}
                                    sx={{
                                      display: "flex",
                                      alignItems: "end",
                                      width: 20,
                                      color: "gray",
                                    }}
                                  >
                                    <DragIndicatorIcon fontSize="small" />
                                  </Box>
                                </Tooltip>
                                <Box
                                  className="image-box"
                                  width={35}
                                  height={33}
                                  mr={1}
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
                                <Box className="url-box" width={270}>
                                  <Typography
                                    variant="body1"
                                    fontSize={14}
                                    noWrap
                                  >
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

            <CardActions sx={{ justifyContent: "center" }}>
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
                onClick={handleAddLink}
              >
                Add Image Links
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateImageCDN;
