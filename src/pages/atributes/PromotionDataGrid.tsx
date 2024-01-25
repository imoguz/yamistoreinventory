import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { toastifySuccess, toastifyError } from "../../helpers/toastify";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import {
  readPromotions,
  deletePromotion,
  createPromotion,
  updatePromotion,
} from "../../features/promotionSlice";

import {
  GridToolbar,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import ConfirmDeletion from "../../components/ConfirmDeletion";

export default function PromotionDataGrid() {
  const { promotions, loading } = useAppSelector((state) => state.promotion);
  const [rows, setRows] = React.useState<IPromotion[]>(promotions);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [confirmDelete, setConfirmDelete] = React.useState<IConfirmDelete>({
    open: false,
    isDelete: false,
    model: "promotion",
    id: null,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(readPromotions());
  }, [dispatch]);

  useEffect(() => {
    setRows(promotions);
  }, [promotions]);

  useEffect(() => {
    const deleteRow = async () => {
      if (confirmDelete.isDelete) {
        const response = await dispatch(
          deletePromotion(confirmDelete.id as string)
        );
        if (response.meta.requestStatus === "fulfilled") {
          setRows(rows.filter((row) => row._id !== confirmDelete.id));
          toastifySuccess("Promotion successfully deleted.");
        } else if (response.meta.requestStatus === "rejected") {
          toastifyError("Network Error. Promotion cannot be deleted...");
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

  const handleDateChange = (id: GridRowId, fieldName: string, date: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row._id === id ? { ...row, [fieldName]: date } : row
      )
    );
  };

  const handleClick = () => {
    const tempId = Date.now().toString();

    setRows((oldRows) => [
      ...oldRows,
      {
        _id: tempId,
        code: null,
        description: "",
        type: "",
        amount: null,
        min_purchase: null,
        expired_date: new Date().toISOString().split("T")[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "code" },
    }));
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setConfirmDelete({ ...confirmDelete, id: id as string, open: true });
  };

  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === _id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row._id !== _id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const newPromotion: INewPromotion = {
      code: newRow.code,
      description: newRow.description,
      type: newRow.type,
      amount: newRow.amount,
      min_purchase: newRow.min_purchase,
      expired_date: newRow.expired_date,
    };
    if (newRow.isNew) {
      // create newPromotion
      const response = await dispatch(createPromotion(newPromotion));
      if (response.meta.requestStatus === "fulfilled") {
        const updatedRow = response.payload as IPromotion;
        setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
        toastifySuccess("Promotion successfully created.");
        return updatedRow;
      } else {
        toastifyError("Network error. Promotion cannot be added...");
        return;
      }
    } else {
      // Update Promotion
      const data = await dispatch(
        updatePromotion({ newPromotion, id: newRow._id })
      );
      if (data.meta.requestStatus === "fulfilled") {
        const updatedRow = { ...newRow, isNew: false } as IPromotion;
        setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
        toastifySuccess("Promotion successfully updated.");
        return updatedRow;
      } else {
        toastifyError("Network error. Promotion cannot be updated...");
        return;
      }
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
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
      field: "code",
      headerName: "Code",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      width: colWidth,
      editable: true,
      type: "singleSelect",
      valueOptions: ["monetary", "percentage"],
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "min_purchase",
      headerName: "Min-Purchase",
      type: "string",
      width: colWidth,
      editable: true,
    },
    {
      field: "expired_date",
      headerName: "Expired Date",
      type: "date",
      width: colWidth,
      editable: true,
      valueGetter: (params) => new Date(params.row.expired_date) || null,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return (
            <TextField
              type="date"
              value={params.row.expired_date || ""}
              onChange={(e) =>
                handleDateChange(params.id, "expired_date", e.target.value)
              }
            />
          );
        } else {
          const formattedDate = params.row.expired_date
            ? new Date(params.row.expired_date).toLocaleDateString()
            : "";

          return formattedDate;
        }
      },
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
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

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
        // width: "100%",
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
        onClick={handleClick}
        sx={{
          mt: 1,
          backgroundColor: "#126E82",
          color: "white",
          "&:hover": { backgroundColor: "#187e95" },
        }}
      >
        Add New Promotion
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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
    </Box>
  );
}
