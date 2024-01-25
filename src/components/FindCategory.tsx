import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { readCategories } from "../features/categorySlice";
import { Box, Button, Typography, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 630,
  bgcolor: "background.paper",
  border: "1px solid #00909e",
  borderRadius: 1,
  boxShadow: 24,
};

interface IFindCategoryProps {
  openModal: IOpenModalState;
  setOpenModal: React.Dispatch<React.SetStateAction<IOpenModalState>>;
  formValues: INewProduct;
  setFormValues: React.Dispatch<React.SetStateAction<INewProduct>>;
}

const FindCategory: React.FC<IFindCategoryProps> = ({
  openModal,
  setOpenModal,
  formValues,
  setFormValues,
}) => {
  const { categories } = useAppSelector((state) => state.category);

  const dispatch = useAppDispatch();
  const [selectedId, setSelectedID] = React.useState("");
  const [filteredCategories, setFilteredCategories] = React.useState<
    ICategory[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      await dispatch(readCategories());
    };
    fetchData();
  }, [dispatch]);

  React.useEffect(() => {
    setFilteredCategories(
      categories.filter((category) => category.parentCategory?.parentCategory)
    );
  }, [dispatch, categories]);

  const handleClose = () => {
    setOpenModal({ ...openModal, category: false });
  };

  const handleClick = (row: any) => {
    setSelectedID(row.id);
  };

  const handleAddCategoryID = () => {
    setFormValues({ ...formValues, category: selectedId });
    setSelectedID("");
    handleClose();
  };
  const columns: GridColDef[] = [
    { field: "_id", headerName: "Category ID", width: 210 },
    {
      field: "parentCategory",
      headerName: "Top-Category/Category/Sub-Category",
      width: 200,
      valueGetter: (params) =>
        params?.row?.parentCategory?.parentCategory?.name +
        "/" +
        params?.row?.parentCategory?.name +
        "/" +
        params.row?.name,
    },
  ];

  return (
    <Modal
      open={openModal.category}
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

        <Box sx={{ height: 410, width: "100%", p: 2 }}>
          <DataGrid
            rows={filteredCategories}
            columns={columns}
            onRowClick={handleClick}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#27496d",
                color: "white",
              },
              ".MuiDataGrid-iconButtonContainer": {
                visibility: "visible",
              },
              ".MuiDataGrid-sortIcon": {
                opacity: "inherit !important",
              },
              ".MuiSvgIcon-root": {
                color: "#DAE1E7",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            mb: 2,
            width: 600,
            mx: "auto",
          }}
        >
          <Button
            color="error"
            variant="contained"
            size="small"
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            color="success"
            variant="contained"
            size="small"
            fullWidth
            disabled={!Boolean(selectedId)}
            onClick={handleAddCategoryID}
          >
            Add Category ID
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FindCategory;
