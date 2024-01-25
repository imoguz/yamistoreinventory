import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { Tooltip, TextField } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { useThemeContext } from "../context/themeContext";
import bgImage from "../assets/bgdotedimg.png";
import { toastifySuccess, toastifyError } from "../helpers/toastify";
import { useAppDispatch } from "../app/hooks";
import {
  readProducts,
  createProduct,
  updateProduct,
} from "../features/productSlice";
import FindBrand from "./FindBrand";
import FindCategory from "./FindCategory";
import FindStore from "./FindStore";
import FindDiscount from "./FindDiscount";
import FindPromotion from "./FindPromotion";
import CreateMultiCDN from "./CreateMultiCDN";

interface ICreateNewProductProps {
  setOpenNP: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: INewProduct;
  setFormValues: React.Dispatch<React.SetStateAction<INewProduct>>;
}

const CreateNewProduct: React.FC<ICreateNewProductProps> = ({
  setOpenNP,
  formValues,
  setFormValues,
}) => {
  const { drawerOpen } = useThemeContext();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState<IOpenModalState>({
    brand: false,
    category: false,
    store: false,
    discount: false,
    promotion: false,
    cdn: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = formValues?.id
      ? await dispatch(
          updateProduct({ newProduct: formValues, id: formValues.id })
        )
      : await dispatch(createProduct(formValues));

    if (response.meta.requestStatus === "fulfilled") {
      dispatch(readProducts());
      toastifySuccess(
        formValues?.id
          ? "Product successfully updated"
          : "New product successfully created."
      );
      setFormValues({
        name: "",
        description: "",
        brand: "",
        category: "",
        store: [],
        price: null,
        discount: "",
        promotion: "",
        images: [],
      });
    } else {
      toastifyError(
        "Error: Unable to create new product. Please check your data and network connection."
      );
    }
  };

  const handleCancel = () => {
    setFormValues({
      name: "",
      description: "",
      brand: "",
      category: "",
      store: [],
      price: null,
      discount: "",
      promotion: "",
      images: [],
    });
    setOpenNP(false);
  };

  return (
    <Paper
      sx={{
        minWidth: 255,
        width: `calc(100vw - ${drawerOpen ? 310 : 130}px)`,
        my: 1,
        p: 2,
        bgcolor: "#27496dc2",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "repeat",
      }}
    >
      <Grid container spacing={1} component="form" onSubmit={handleSubmit}>
        <Grid item>
          <Grid
            container
            columnSpacing={10}
            rowSpacing={2}
            justifyContent={"center"}
          >
            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Name:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Enter paroduct name..."
                  value={formValues.name}
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      name: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Description:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Enter a description..."
                  value={formValues.description}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 500 }}
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Brand:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Select or enter a brand ID..."
                  variant="outlined"
                  value={formValues.brand}
                  size="small"
                  onChange={(e) =>
                    setFormValues({ ...formValues, brand: e.target.value })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to find brand">
                          <IconButton
                            aria-label="search"
                            size="small"
                            onClick={() =>
                              setOpenModal({ ...openModal, brand: true })
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Category:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Select or enter a category ID..."
                  variant="outlined"
                  value={formValues.category}
                  size="small"
                  onChange={(e) =>
                    setFormValues({ ...formValues, category: e.target.value })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to find category">
                          <IconButton
                            aria-label="search"
                            size="small"
                            onClick={() =>
                              setOpenModal({ ...openModal, category: true })
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Store ID :</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Select or enter a store ID..."
                  variant="outlined"
                  value={formValues.store}
                  size="small"
                  onChange={(e) =>
                    setFormValues({ ...formValues, store: [e.target.value] })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to find store">
                          <IconButton
                            aria-label="search"
                            size="small"
                            onClick={() =>
                              setOpenModal({ ...openModal, store: true })
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Price:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Enter a price..."
                  type="number"
                  value={formValues.price || ""}
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      price: +e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Discount:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Select or enter a discount ID..."
                  variant="outlined"
                  value={formValues.discount}
                  size="small"
                  onChange={(e) =>
                    setFormValues({ ...formValues, discount: e.target.value })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to find discount ID">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() =>
                              setOpenModal({ ...openModal, discount: true })
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Promotion:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Select or enter a promotion ID..."
                  variant="outlined"
                  value={formValues.promotion}
                  size="small"
                  onChange={(e) =>
                    setFormValues({ ...formValues, promotion: e.target.value })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to find promotion ID">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() =>
                              setOpenModal({ ...openModal, promotion: true })
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Images:</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Create or enter image URL..."
                  variant="outlined"
                  value={formValues.images}
                  size="small"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      images: [{ url: e.target.value, isMainImage: false }],
                    })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to create image CDN">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() =>
                              setOpenModal({ ...openModal, cdn: true })
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          display="flex"
          gap={2}
          justifyContent="center"
          mt={2}
          mr={1}
        >
          <Button
            sx={{ width: { xs: 100, sm: 130 } }}
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            startIcon={<SaveIcon />}
            sx={{ width: { xs: 100, sm: 130 } }}
          >
            {formValues?.id ? "Update" : "Save"}
          </Button>
        </Grid>
      </Grid>
      {/* <FindProduct {...{ openFP, setOpenFP, formValues, setFormValues }} /> */}
      <FindBrand {...{ openModal, setOpenModal, formValues, setFormValues }} />
      <FindCategory
        {...{ openModal, setOpenModal, formValues, setFormValues }}
      />
      <FindStore {...{ openModal, setOpenModal, formValues, setFormValues }} />
      <FindDiscount
        {...{ openModal, setOpenModal, formValues, setFormValues }}
      />
      <FindPromotion
        {...{ openModal, setOpenModal, formValues, setFormValues }}
      />
      <CreateMultiCDN
        {...{ openModal, setOpenModal, formValues, setFormValues }}
      />
    </Paper>
  );
};

export default CreateNewProduct;
