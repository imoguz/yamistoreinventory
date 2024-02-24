import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Tooltip, IconButton, InputAdornment, Select } from "@mui/material";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { useThemeContext } from "../../context/themeContext";
import bgImage from "../../assets/bgdotedimg.png";
import CreateMultiCDN from "./CreateMultiCDN";
import { toastifySuccess, toastifyError } from "../../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  readProducts,
  createProduct,
  updateProduct,
} from "../../features/productSlice";
import { readBrands } from "../../features/brandSlice";
import { readDiscounts } from "../../features/discountSlice";
import { readPromotions } from "../../features/promotionSlice";
import { readCategories } from "../../features/categorySlice";
import { readStores } from "../../features/storeSlice";

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
  const [openModal, setOpenModal] = useState<boolean>(false);

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
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(readBrands());
      await dispatch(readDiscounts());
      await dispatch(readPromotions());
      await dispatch(readCategories());
      await dispatch(readStores());
    };
    fetchData();
  }, [dispatch]);
  const { brands } = useAppSelector((state) => state.brand);
  const { discounts } = useAppSelector((state) => state.discount);
  const { promotions } = useAppSelector((state) => state.promotion);
  const { categories } = useAppSelector((state) => state.category);
  const { stores } = useAppSelector((state) => state.store);

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
                <Typography variant="subtitle1">Brand :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a brand
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.brand}
                    label="Select a brand"
                    onChange={(e) =>
                      setFormValues({ ...formValues, brand: e.target.value })
                    }
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        style: {
                          maxHeight: 260,
                        },
                      },
                    }}
                  >
                    {brands.map((brand, index) => (
                      <MenuItem key={index} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Category :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.category}
                    label="Select a category"
                    onChange={(e) =>
                      setFormValues({ ...formValues, category: e.target.value })
                    }
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        style: {
                          maxHeight: 260,
                        },
                      },
                    }}
                  >
                    {categories.map((category, index) =>
                      category?.parentCategory?.parentCategory?.name ? (
                        <MenuItem key={index} value={category._id}>
                          {category?.parentCategory?.parentCategory?.name}/
                          {category?.parentCategory?.name}/{category.name}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Store :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a store
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.store[0]}
                    label="Select a store"
                    onChange={(e) =>
                      setFormValues({ ...formValues, store: [e.target.value] })
                    }
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        style: {
                          maxHeight: 260,
                        },
                      },
                    }}
                  >
                    {stores.map((store, index) => (
                      <MenuItem key={index} value={store._id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                <Typography variant="subtitle1">Discount :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a discount
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.discount}
                    label="Select a discount"
                    onChange={(e) =>
                      setFormValues({ ...formValues, discount: e.target.value })
                    }
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        style: {
                          maxHeight: 260,
                        },
                      },
                    }}
                  >
                    {discounts.map((discount, index) => (
                      <MenuItem key={index} value={discount._id}>
                        {discount.type} / {discount.amount}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Promotion :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a promotion
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.promotion}
                    label="Select a promotion"
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        promotion: e.target.value,
                      })
                    }
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        style: {
                          maxHeight: 260,
                        },
                      },
                    }}
                  >
                    {promotions.map((promotion, index) => (
                      <MenuItem key={index} value={promotion._id}>
                        {promotion.type} / {promotion.amount}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                            onClick={() => setOpenModal(true)}
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
      <CreateMultiCDN
        {...{ openModal, setOpenModal, formValues, setFormValues }}
      />
    </Paper>
  );
};

export default CreateNewProduct;
