import React, { useState } from "react";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { InputLabel, MenuItem, Tooltip, TextField } from "@mui/material";
import { FormControl, IconButton, InputAdornment } from "@mui/material";
import { Button, Grid, Paper, Select, Typography } from "@mui/material";
import { useThemeContext } from "../context/themeContext";
import bgImage from "../assets/bgdotedimg.png";
import FindProduct from "./FindProduct";
import CreateCDN from "./CreateCDN";
import { toastifySuccess, toastifyError } from "../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { readVariants, createVariant } from "../features/variantSlice";

interface ICreateNewVariantProps {
  setOpenNV: React.Dispatch<React.SetStateAction<boolean>>;
  formValues: INewVariantForm;
  setFormValues: React.Dispatch<React.SetStateAction<INewVariantForm>>;
}

const CreateNewVariant: React.FC<ICreateNewVariantProps> = ({
  setOpenNV,
  formValues,
  setFormValues,
}) => {
  const { drawerOpen } = useThemeContext();
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.color);
  const { sizes } = useAppSelector((state) => state.size);
  const [openFP, setOpenFP] = useState<boolean>(false);
  const [openCDN, setOpenCDN] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await dispatch(createVariant(formValues));
    if (response.meta.requestStatus === "fulfilled") {
      dispatch(readVariants());
      toastifySuccess("Variant successfully created.");
      setFormValues({
        product_id: "",
        color_id: "",
        size_id: "",
        image_url: "",
        stock: null,
        isDefault: null,
      });
    } else {
      toastifyError(
        "Error: Unable to add variant. Please check your data and network connection."
      );
    }
  };

  const handleCancel = () => {
    setFormValues({
      product_id: "",
      color_id: "",
      size_id: "",
      image_url: "",
      stock: null,
      isDefault: null,
    });
    setOpenNV(false);
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
        <Grid item xs={12}>
          <Grid
            container
            columnSpacing={10}
            rowSpacing={2}
            justifyContent={"center"}
          >
            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Product ID :</Typography>
              </Grid>
              <Grid>
                <TextField
                  id="filled-basic"
                  label="Product ID"
                  variant="outlined"
                  value={formValues.product_id}
                  size="small"
                  onChange={(e) =>
                    setFormValues({ ...formValues, product_id: e.target.value })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mx: 0 }}>
                        <Tooltip title="Click to find product ID">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => setOpenFP(true)}
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
                <Typography variant="subtitle1">Size :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a size
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.size_id}
                    label="Select a size"
                    onChange={(e) =>
                      setFormValues({ ...formValues, size_id: e.target.value })
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
                    {sizes.map((size, index) => (
                      <MenuItem key={index} value={size._id}>
                        {size.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Color :</Typography>
              </Grid>
              <Grid>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select a color
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValues.color_id}
                    label="Select a color"
                    onChange={(e) =>
                      setFormValues({ ...formValues, color_id: e.target.value })
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
                    {colors.map((color, index) => (
                      <MenuItem key={index} value={color._id}>
                        <FormatColorFillIcon
                          sx={{
                            color:
                              color.name === "white"
                                ? "#f5f5f5"
                                : color.hex_code,
                            mr: 2,
                          }}
                        />
                        {color.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Image URL :</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="filled-basic"
                  label="Add CDN link"
                  variant="outlined"
                  size="small"
                  value={formValues.image_url}
                  onChange={(e) =>
                    setFormValues({ ...formValues, image_url: e.target.value })
                  }
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Click to create CDN link">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => setOpenCDN(true)}
                          >
                            <DesignServicesIcon />
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
                <Typography variant="subtitle1">Is Default :</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Is Default Variant?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={
                      formValues.isDefault === null
                        ? ""
                        : formValues.isDefault
                        ? "1"
                        : "0"
                    }
                    label="Is Default Variant?"
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        isDefault: Boolean(+e.target.value),
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
                    <MenuItem value={"1"}>True</MenuItem>
                    <MenuItem value={"0"}>False</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item display={{ sm: "block", md: "flex" }} alignItems={"end"}>
              <Grid minWidth={100}>
                <Typography variant="subtitle1">Stock :</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="filled-basic"
                  label="Stock amount"
                  type="number"
                  value={formValues.stock || ""}
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      stock: +e.target.value,
                    })
                  }
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
            Save
          </Button>
        </Grid>
      </Grid>
      <FindProduct {...{ openFP, setOpenFP, formValues, setFormValues }} />
      <CreateCDN {...{ openCDN, setOpenCDN, formValues, setFormValues }} />
    </Paper>
  );
};

export default CreateNewVariant;
