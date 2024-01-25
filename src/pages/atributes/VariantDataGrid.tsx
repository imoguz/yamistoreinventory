import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Button, CircularProgress, Collapse } from "@mui/material";
import { toastifySuccess, toastifyError } from "../../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import { readVariants, deleteVariant } from "../../features/variantSlice";
import { readSizes } from "../../features/sizeSlice";
import { readColors } from "../../features/colorSlice";
import {
  GridToolbar,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import ConfirmDeletion from "../../components/ConfirmDeletion";
import CreateNewVariant from "../../components/CreateNewVariant";

export default function VariantDataGrid() {
  const { variants, loading } = useAppSelector((state) => state.variant);
  const { sizes } = useAppSelector((state) => state.size);
  const { colors } = useAppSelector((state) => state.color);
  const [rows, setRows] = React.useState<IVariant[]>(variants);
  const [openNV, setOpenNV] = React.useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = React.useState<IConfirmDelete>({
    open: false,
    isDelete: false,
    model: "variant",
    id: null,
  });
  const [formValues, setFormValues] = React.useState<INewVariantForm>({
    product_id: "",
    color_id: "",
    size_id: "",
    image_url: "",
    stock: null,
    isDefault: null,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readVariants());
    dispatch(readSizes());
    dispatch(readColors());
  }, [dispatch]);

  useEffect(() => {
    setRows(variants);
  }, [variants]);

  useEffect(() => {
    const deleteRow = async () => {
      if (confirmDelete.isDelete) {
        const response = await dispatch(
          deleteVariant(confirmDelete.id as string)
        );
        if (response.meta.requestStatus === "fulfilled") {
          setRows(rows.filter((row) => row._id !== confirmDelete.id));
          toastifySuccess("Variant successfully deleted.");
        } else if (response.meta.requestStatus === "rejected") {
          toastifyError("Network Error. Variant cannot be deleted...");
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
    const selectedVariant = variants.find((variant) => variant._id === id);
    if (selectedVariant) {
      setFormValues({
        product_id: selectedVariant.product_id._id,
        color_id: selectedVariant.color_id._id,
        size_id: selectedVariant.size_id._id,
        image_url: selectedVariant.image_url,
        stock: selectedVariant.stock,
        isDefault: selectedVariant.isDefault,
      });
    }
    setOpenNV(true);
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setConfirmDelete({ ...confirmDelete, id: id as string, open: true });
  };

  const colWidth = 120;
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      width: 120,
      type: "string",
      editable: false,
    },
    {
      field: "product_id",
      headerName: "Product Id",
      type: "string",
      width: colWidth,
      editable: false,
      valueGetter: (params) => params?.row?.product_id?._id || "",
    },
    {
      field: "size_id",
      headerName: "Size",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: true,
      type: "singleSelect",
      valueOptions: sizes?.map((item) => item?.name),
      valueGetter: (params) => params?.row?.size_id?.name || "",
    },
    {
      field: "color_id",
      headerName: "Color Id",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: true,
      type: "singleSelect",
      valueOptions: colors?.map((item) => item?.name),
      valueGetter: (params) => params?.row?.color_id?.name || "",
    },
    {
      field: "image_url",
      headerName: "Image Url",
      type: "string",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "string",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "isDefault",
      headerName: "isDefault",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: true,
      type: "singleSelect",
      valueOptions: ["true", "false"],
      valueGetter: (params) => params?.row?.isDefault || "",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      type: "date",
      width: colWidth,
      editable: false,
      valueGetter: (params) => new Date(params.row.updatedAt),
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
        onClick={() => setOpenNV(true)}
        sx={{
          mt: 1,
          backgroundColor: "#126E82",
          color: "white",
          "&:hover": { backgroundColor: "#187e95" },
        }}
      >
        Add New Variant
      </Button>
      <Collapse in={openNV}>
        <CreateNewVariant {...{ setOpenNV, formValues, setFormValues }} />
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
      {openNV && <Box py={2}></Box>}
    </Box>
  );
}
