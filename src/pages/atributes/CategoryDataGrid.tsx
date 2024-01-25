import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Button, CircularProgress, Collapse } from "@mui/material";
import { toastifySuccess, toastifyError } from "../../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { readCategories, deleteCategory } from "../../features/categorySlice";
import {
  GridToolbar,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import ConfirmDeletion from "../../components/ConfirmDeletion";
import CreateNewCategory from "../../components/CreateNewCategory";

export default function CategoryDataGrid() {
  const { categories, loading } = useAppSelector((state) => state.category);
  const [rows, setRows] = useState<ICategoryRows[]>([]);
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [value, setValue] = useState("1");
  const [formValues, setFormValues] = useState<INewCategoryForm>({
    topCategory: "",
    category: "",
    subCategory: "",
    id: "",
    isEdit: false,
  });

  const [confirmDelete, setConfirmDelete] = useState<IConfirmDelete>({
    open: false,
    isDelete: false,
    model: "color",
    id: null,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    const readFn = async () => {
      await dispatch(readCategories());
    };
    readFn();
  }, [dispatch]);

  useEffect(() => {
    const topCategory = categories
      .map((item) => {
        if (!item?.parentCategory) {
          return {
            _id: item._id,
            topCategory: item.name,
            category: "",
            subCategory: "",
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        } else if (!item?.parentCategory?.parentCategory) {
          return {
            _id: item._id,
            topCategory: item.parentCategory.name,
            category: item.name,
            subCategory: "",
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        } else if (item?.parentCategory?.parentCategory) {
          return {
            _id: item._id,
            topCategory: item.parentCategory.parentCategory.name,
            category: item.parentCategory.name,
            subCategory: item.name,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }
        return null;
      })
      .filter(Boolean);

    setRows(topCategory as ICategoryRows[]);
  }, [categories]);

  useEffect(() => {
    const deleteRow = async () => {
      if (confirmDelete.isDelete) {
        const response = await dispatch(
          deleteCategory(confirmDelete.id as string)
        );
        if (response.meta.requestStatus === "fulfilled") {
          setRows(rows.filter((row) => row._id !== confirmDelete.id));
          toastifySuccess("Category successfully deleted.");
        } else if (response.meta.requestStatus === "rejected") {
          toastifyError("Network Error. Category cannot be deleted...");
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

  const handleEditClick = (id: GridRowId) => () => {
    const selectedCategory = categories.find((category) => category._id === id);
    if (selectedCategory) {
      if (!selectedCategory.parentCategory) {
        setFormValues({
          ...formValues,
          topCategory: selectedCategory.name,
          id: id as string,
          isEdit: true,
        });
        setValue("1");
      } else if (!selectedCategory.parentCategory?.parentCategory) {
        setFormValues({
          ...formValues,
          topCategory: selectedCategory.parentCategory._id,
          category: selectedCategory.name,
          id: id as string,
          isEdit: true,
        });
        setValue("2");
      } else if (selectedCategory.parentCategory?.parentCategory) {
        setFormValues({
          ...formValues,
          topCategory: selectedCategory.parentCategory.parentCategory._id,
          category: selectedCategory.parentCategory._id,
          subCategory: selectedCategory.name,
          id: id as string,
          isEdit: true,
        });
        setValue("3");
      }
    }
    setNewCategory(true);
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setConfirmDelete({ ...confirmDelete, id: id as string, open: true });
  };

  const colWidth = 150;
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      width: 210,
      type: "string",
      editable: false,
    },
    {
      field: "topCategory",
      headerName: "Top Category",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "subCategory",
      headerName: "Sub Category",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      type: "date",
      width: colWidth,
      editable: false,
      valueGetter: (params) => new Date(params.row.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      type: "date",
      width: colWidth,
      editable: false,
      valueGetter: (params) => new Date(params.row.updatedAt),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: colWidth,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <Box
      sx={{
        height: 500,
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
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
      <ConfirmDeletion {...{ confirmDelete, setConfirmDelete }} />
      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setNewCategory(true)}
        sx={{
          mt: 1,
          backgroundColor: "#126E82",
          color: "white",
          "&:hover": { backgroundColor: "#187e95" },
        }}
      >
        Add New Category
      </Button>
      <Collapse in={newCategory}>
        <CreateNewCategory
          {...{ setNewCategory, value, setValue, formValues, setFormValues }}
        />
      </Collapse>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        slots={{
          toolbar: GridToolbar,
        }}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#27496D",
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            color: "#DAE1E7",
          },
          ".MuiDataGrid-iconButtonContainer": {
            visibility: "visible",
          },
          ".MuiDataGrid-sortIcon": {
            opacity: "inherit !important",
            color: "#DAE1E7",
          },
          ".MuiDataGrid-toolbarContainer": {
            backgroundColor: "#27496D",
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
          },
          ".MuiDataGrid-toolbarContainer .MuiButtonBase-root": {
            color: "#DAE1E7",
          },
        }}
      />
      {newCategory && <Box py={2}></Box>}
    </Box>
  );
}
