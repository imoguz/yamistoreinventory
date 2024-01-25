import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Button, CircularProgress, Collapse } from "@mui/material";
import { toastifySuccess, toastifyError } from "../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import { readProducts, deleteProduct } from "../features/productSlice";
import {
  GridToolbar,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import ConfirmDeletion from "../components/ConfirmDeletion";
import CreateNewProduct from "../components/CreateNewProduct";

export default function Product() {
  const { products, loading } = useAppSelector((state) => state.product);
  const [rows, setRows] = React.useState<IProduct[]>(products);
  const [openNP, setOpenNP] = React.useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = React.useState<IConfirmDelete>({
    open: false,
    isDelete: false,
    model: "product",
    id: null,
  });

  const [formValues, setFormValues] = React.useState<INewProduct>({
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readProducts());
  }, [dispatch]);

  useEffect(() => {
    setRows(products);
  }, [products]);

  useEffect(() => {
    const deleteRow = async () => {
      if (confirmDelete.isDelete) {
        const response = await dispatch(
          deleteProduct(confirmDelete.id as string)
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
      }
    };
    if (confirmDelete.isDelete) {
      deleteRow();
      setConfirmDelete({
        open: false,
        isDelete: false,
        model: "variant",
        id: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmDelete.isDelete]);

  const handleEditClick = (id: GridRowId) => () => {
    const selectedProduct: IProduct | undefined = products.find(
      (product) => product._id === id
    );
    console.log(selectedProduct);
    if (selectedProduct) {
      setFormValues({
        id: selectedProduct._id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        brand: selectedProduct.brand._id,
        category: selectedProduct.category._id,
        store: selectedProduct.store.map((i) => {
          return i._id;
        }),
        price: selectedProduct.price,
        discount: selectedProduct.discount._id,
        promotion: selectedProduct.promotion._id,
        images: selectedProduct.images.map((i) => {
          return i.url;
        }),
      } as any);
    }
    setOpenNP(true);
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setConfirmDelete({ ...confirmDelete, id: id as string, open: true });
  };
  const colWidth = 90;
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      width: 120,
      type: "string",
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 120,
      type: "string",
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 120,
      type: "string",
      editable: true,
    },
    {
      field: "brand",
      headerName: "Brand",
      type: "string",
      width: colWidth,
      editable: false,
      valueGetter: (params) => params.row.brand.name || "",
    },
    {
      field: "category",
      headerName: "Category",
      width: colWidth,
      editable: true,
      valueGetter: (params) => {
        const topC = params.row.category?.parentCategory?.parentCategory?.name;
        const cat = params.row.category?.parentCategory?.name;
        const subC = params.row.category?.name;
        return `${topC}/${cat}/${subC}`;
      },
    },
    {
      field: "store",
      headerName: "Store",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: false,
      type: "singleSelect",
      valueOptions: (params) => {
        const productStores = params.row.store.map((store: any) => store.name);
        return productStores;
      },
      valueGetter: (params) => params.row.store[0].name,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: colWidth,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "discount",
      headerName: "Discount",
      type: "string",
      width: colWidth,
      editable: true,
      valueGetter: (params) => {
        const amount = params.row.discount?.amount;
        const type = params.row.discount?.type;
        return type === "percentage" ? `${amount}%` : `$${amount}`;
      },
    },
    {
      field: "promotion",
      headerName: "Promotion",
      type: "string",
      width: colWidth,
      editable: true,
      valueGetter: (params) => {
        const amount = params.row.promotion?.amount;
        const type = params.row.promotion?.type;
        return type === "percentage" ? `${amount}%` : `$${amount}`;
      },
    },
    // {
    //   field: "variants",
    //   headerName: "Variants",
    //   width: colWidth,
    //   align: "left",
    //   headerAlign: "left",
    //   editable: true,
    //   type: "singleSelect",
    //   valueOptions: colors?.map((item) => item?.name),
    //   valueGetter: (params) => params.row.color_id?.name || "",
    // },
    // {
    //   field: "images",
    //   headerName: "Variants",
    //   width: colWidth,
    //   align: "left",
    //   headerAlign: "left",
    //   editable: true,
    //   type: "singleSelect",
    //   valueOptions: colors?.map((item) => item?.name),
    //   valueGetter: (params) => params.row.color_id?.name || "",
    // },
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
        onClick={() => setOpenNP(true)}
        sx={{
          mt: 1,
          backgroundColor: "#126E82",
          color: "white",
          "&:hover": { backgroundColor: "#187e95" },
        }}
      >
        Add New Product
      </Button>
      <Collapse in={openNP}>
        <CreateNewProduct {...{ setOpenNP, formValues, setFormValues }} />
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
      {openNP && <Box py={2}></Box>}
    </Box>
  );
}
