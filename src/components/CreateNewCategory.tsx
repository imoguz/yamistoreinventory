import SaveIcon from "@mui/icons-material/Save";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useThemeContext } from "../context/themeContext";
import { Box, Button, Grid, Paper } from "@mui/material";
import { Tab, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import bgImage from "../assets/bgdotedimg.png";
import { toastifySuccess, toastifyError } from "../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  readCategories,
  createCategory,
  updateCategory,
} from "../features/categorySlice";
import { TabContext, TabList, TabPanel } from "@mui/lab";

interface ICreateNewCategoryProps {
  setNewCategory: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  formValues: INewCategoryForm;
  setFormValues: React.Dispatch<React.SetStateAction<INewCategoryForm>>;
}

const CreateNewCategory: React.FC<ICreateNewCategoryProps> = ({
  setNewCategory,
  formValues,
  setFormValues,
  value,
  setValue,
}) => {
  const { drawerOpen } = useThemeContext();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const [categoryList, setCategoryList] = useState<ICategoryListState>({
    topCategories: [],
    categories: [],
  });

  useEffect(() => {
    const filterTop = categories
      .map((item) => {
        if (!item?.parentCategory) {
          return {
            id: item._id,
            name: item.name,
          };
        }
        return null;
      })
      .filter(Boolean);

    const filterCat = categories
      .map((item) => {
        if (item?.parentCategory && !item?.parentCategory?.parentCategory) {
          return {
            id: item._id,
            name: item.name,
            topCategory: item.parentCategory._id,
          };
        }
        return null;
      })
      .filter(Boolean);

    setCategoryList({
      topCategories: filterTop,
      categories: filterCat,
    } as ICategoryListState);
  }, [categories]);

  const handleSaveClick = async () => {
    let newCategory: INewCategory;

    if (value === "1") {
      newCategory = {
        name: formValues.topCategory,
      };
    } else if (value === "2") {
      newCategory = {
        name: formValues.category,
        parentCategory: formValues.topCategory,
      };
    } else if (value === "3") {
      newCategory = {
        name: formValues.subCategory,
        parentCategory: formValues.category,
      };
    } else return;
    const response = formValues.isEdit
      ? await dispatch(updateCategory({ newCategory, id: formValues.id }))
      : await dispatch(createCategory(newCategory));

    if (response.meta.requestStatus === "fulfilled") {
      await dispatch(readCategories());
      toastifySuccess("Category successfully created.");
      setFormValues({
        topCategory: "",
        category: "",
        subCategory: "",
        id: "",
        isEdit: false,
      });
    } else {
      toastifyError(
        "Error: Unable to add category. Please check your data and network connection."
      );
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setFormValues({
      topCategory: "",
      category: "",
      subCategory: "",
      id: "",
      isEdit: false,
    });
  };

  const handleCancel = () => {
    setFormValues({
      topCategory: "",
      category: "",
      subCategory: "",
      id: "",
      isEdit: false,
    });
    setNewCategory(false);
  };

  return (
    <Paper
      sx={{
        minWidth: 255,
        maxWidth: 700,
        width: `calc(100vw - ${drawerOpen ? 310 : 130}px)`,
        my: 1,
        p: 1,
        pb: 2,
        bgcolor: "#27496dc2",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "repeat",
      }}
    >
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              <Tab label="Top Category" value="1" />
              <Tab label="Category" value="2" />
              <Tab label="Sub Category" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ px: { xs: 0.5, sm: 3 } }}>
            <Grid
              container
              spacing={1}
              component="form"
              display={{ xs: "block", sm: "flex" }}
              alignItems={"end"}
            >
              <Grid item minWidth={125}>
                <Typography variant="subtitle1">Top Category :</Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="filled-basic"
                  label="Top category name"
                  value={formValues.topCategory}
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      topCategory: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="2" sx={{ px: { xs: 0.5, sm: 3 } }}>
            <Grid container component="form">
              <Grid
                item
                display={{ sm: "block", md: "flex" }}
                alignItems={"end"}
              >
                <Grid minWidth={125}>
                  <Typography variant="subtitle1">Top Category:</Typography>
                </Grid>
                <Grid>
                  <FormControl
                    sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Select a top category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formValues.topCategory}
                      label="Select a top category"
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          topCategory: e.target.value,
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
                      {categoryList?.topCategories?.map(
                        (topCategory, index) => (
                          <MenuItem key={index} value={topCategory.id}>
                            {topCategory.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                display={{ sm: "block", md: "flex" }}
                alignItems={"end"}
                mt={2}
              >
                <Grid minWidth={125}>
                  <Typography variant="subtitle1">Category :</Typography>
                </Grid>
                <Grid>
                  <TextField
                    id="filled-basic"
                    label="Category name"
                    value={formValues.category}
                    variant="outlined"
                    size="small"
                    sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                    onChange={(e) =>
                      setFormValues({ ...formValues, category: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="3" sx={{ px: { xs: 0.5, sm: 3 } }}>
            <Grid container component="form">
              <Grid
                item
                display={{ sm: "block", md: "flex" }}
                alignItems={"end"}
              >
                <Grid minWidth={125}>
                  <Typography variant="subtitle1">Top Category:</Typography>
                </Grid>
                <Grid>
                  <FormControl
                    sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Select a top category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formValues.topCategory}
                      label="Select a top category"
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          topCategory: e.target.value,
                          category: categories.find(
                            (item) =>
                              item.parentCategory?._id !== e.target.value
                          )
                            ? ""
                            : formValues.category,
                        });
                      }}
                      MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                          style: {
                            maxHeight: 260,
                          },
                        },
                      }}
                    >
                      {categoryList?.topCategories?.map(
                        (topCategory, index) => (
                          <MenuItem key={index} value={topCategory.id}>
                            {topCategory.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                display={{ sm: "block", md: "flex" }}
                alignItems={"end"}
                my={2}
              >
                <Grid minWidth={125}>
                  <Typography variant="subtitle1">Category:</Typography>
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
                        setFormValues({
                          ...formValues,
                          category: e.target.value as string,
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
                      {formValues.topCategory &&
                        categoryList?.categories
                          ?.filter(
                            (item) =>
                              item?.topCategory === formValues.topCategory
                          )
                          .map((category, index) => (
                            <MenuItem key={index} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                display={{ sm: "block", md: "flex" }}
                alignItems={"end"}
              >
                <Grid minWidth={125}>
                  <Typography variant="subtitle1">Category :</Typography>
                </Grid>
                <Grid>
                  <TextField
                    id="filled-basic"
                    label="Category name"
                    value={formValues.subCategory}
                    variant="outlined"
                    size="small"
                    sx={{ width: { xs: 240, sm: 285 }, bgcolor: "white" }}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        subCategory: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Box>
      <Grid
        item
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mt: 1,
          mr: { md: 12 },
        }}
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
          color="success"
          disabled={
            value === "3"
              ? Boolean(
                  !formValues.category ||
                    !formValues.subCategory ||
                    !formValues.topCategory
                )
              : value === "2"
              ? Boolean(!formValues.category || !formValues.topCategory)
              : Boolean(!formValues.topCategory)
          }
          startIcon={<SaveIcon />}
          sx={{ width: { xs: 100, sm: 130 } }}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </Grid>
    </Paper>
  );
};

export default CreateNewCategory;
