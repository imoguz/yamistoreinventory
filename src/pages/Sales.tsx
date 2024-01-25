// import * as React from "react";
// import AddIcon from "@mui/icons-material/Add";
// import ImageIcon from "@mui/icons-material/Image";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";
// import SaveIcon from "@mui/icons-material/Save";
// import SearchIcon from "@mui/icons-material/Search";
// import CancelIcon from "@mui/icons-material/Close";
// import FindProduct from "../components/FindProduct";
// import { Box, Button, CircularProgress } from "@mui/material";
// import { toastifySuccess, toastifyError } from "../helpers/toastify";
// import { useAppSelector, useAppDispatch } from "../app/hooks";
// import { useEffect } from "react";
// import {
//   readVariants,
//   deleteVariant,
//   createVariant,
//   updateVariant,
// } from "../features/variantSlice";
// import { readSizes } from "../features/sizeSlice";
// import { readColors } from "../features/colorSlice";

// import {
//   GridToolbar,
//   GridRowModesModel,
//   GridRowModes,
//   DataGrid,
//   GridColDef,
//   GridActionsCellItem,
//   GridEventListener,
//   GridRowId,
//   GridRowModel,
//   GridRowEditStopReasons,
// } from "@mui/x-data-grid";
// import ConfirmDeletion from "../components/ConfirmDeletion";
// import CreateCDN from "../components/CreateCDN";

// export default function VariantDataGrid() {
//   const { variants, loading } = useAppSelector((state) => state.variant);
//   const { sizes } = useAppSelector((state) => state.size);
//   const { colors } = useAppSelector((state) => state.color);
//   const [openCDN, setOpenCDN] = React.useState<IOpenCDN>({
//     open: false,
//     link: null,
//     confirm: false,
//   });
//   const [rows, setRows] = React.useState<IVariant[]>(variants);
//   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
//     {}
//   );
//   const [confirmDelete, setConfirmDelete] = React.useState<IConfirmDelete>({
//     open: false,
//     isDelete: false,
//     model: "variant",
//     id: null,
//   });
//   const [newRecord, setNewRecord] = React.useState<INewRecord>({
//     values: {
//       product_id: { _id: "" },
//       size_id: "",
//       color_id: "",
//       image_url: "",
//       stock: null,
//       isDefault: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       isNew: true,
//     },
//     openFindProduct: false,
//     openCreateCDN: false,
//     selectedProductID: null,
//     CDNLink: null,
//     error: null,
//   });

//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(readVariants());
//     dispatch(readSizes());
//     dispatch(readColors());
//   }, [dispatch]);

//   useEffect(() => {
//     setRows(variants);
//   }, [variants]);

//   useEffect(() => {
//     const deleteRow = async () => {
//       if (confirmDelete.isDelete) {
//         const response = await dispatch(
//           deleteVariant(confirmDelete.id as string)
//         );
//         if (response.meta.requestStatus === "fulfilled") {
//           setRows(rows.filter((row) => row._id !== confirmDelete.id));
//           toastifySuccess("Variant successfully deleted.");
//         } else if (response.meta.requestStatus === "rejected") {
//           toastifyError("Network Error. Variant cannot be deleted...");
//         } else {
//           toastifyError(
//             "An unexpected error happened. Please, try again later..."
//           );
//         }
//       }
//     };

//     if (confirmDelete.isDelete) {
//       deleteRow();
//       setConfirmDelete({
//         open: false,
//         isDelete: false,
//         model: "variant",
//         id: null,
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [confirmDelete.isDelete]);

//   const handleClick = () => {
//     if (rows.find((item) => item._id.slice(0, 5) === "temp-")) return;
//     const tempId = "temp-" + Date.now().toString();
//     if (!rows.find((item) => item._id === "tempid01")) {
//       setRows((oldRows) => [
//         ...oldRows,
//         { ...newRecord.values, _id: tempId } as any,
//       ]);

//       setRowModesModel((oldModel) => ({
//         ...oldModel,
//         [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "product_id" },
//       }));
//     }
//   };

//   const handleRowEditStop: GridEventListener<"rowEditStop"> = (
//     params,
//     event
//   ) => {
//     if (params.reason === GridRowEditStopReasons.rowFocusOut) {
//       event.defaultMuiPrevented = true;
//     }
//   };

//   const handleEditClick = (_id: GridRowId) => () => {
//     setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.Edit } });
//   };

//   const handleSaveClick = (id: GridRowId) => () => {
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
//   };

//   const handleDeleteClick = (id: GridRowId) => async () => {
//     setConfirmDelete({ ...confirmDelete, id: id as string, open: true });
//   };

//   const handleCancelClick = (_id: GridRowId) => () => {
//     setRowModesModel({
//       ...rowModesModel,
//       [_id]: { mode: GridRowModes.View, ignoreModifications: true },
//     });

//     const editedRow = rows.find((row) => row._id === _id);
//     if (editedRow!.isNew) {
//       setRows(rows.filter((row) => row._id !== _id));
//     }
//   };

//   const processRowUpdate = async (newRow: GridRowModel) => {
//     const newVariant: INewVariant = {
//       product_id: newRow.product_id,
//       size_id: sizes.find((item) => item.name === newRow.size_id)?._id || "",
//       color_id: colors.find((item) => item.name === newRow.color_id)?._id || "",
//       image_url: newRow.image_url,
//       stock: newRow.stock,
//       isDefault: newRow.isDefault,
//     };
//     if (newRow.isNew) {
//       // create newVariant
//       const response = await dispatch(createVariant(newVariant));
//       if (response.meta.requestStatus === "fulfilled") {
//         const updatedRow = response.payload as IVariant;
//         dispatch(readVariants());
//         toastifySuccess("Variant successfully created.");
//         return updatedRow;
//       } else {
//         toastifyError(
//           "Error: Unable to add variant. Please check your data and network connection."
//         );
//         return;
//       }
//     } else {
//       // Update Variant
//       const data = await dispatch(
//         updateVariant({ newVariant, id: newRow._id })
//       );
//       if (data.meta.requestStatus === "fulfilled") {
//         const updatedRow = { ...newRow, isNew: false } as IVariant;
//         setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
//         toastifySuccess("Variant successfully updated.");
//         return updatedRow;
//       } else {
//         toastifyError(
//           "Error: Unable to update variant. Please check your data and network connection."
//         );
//         return;
//       }
//     }
//   };
//   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
//     setRowModesModel(newRowModesModel);
//   };

//   const colWidth = 120;
//   const columns: GridColDef[] = [
//     {
//       field: "_id",
//       headerName: "ID",
//       width: 120,
//       type: "string",
//       editable: false,
//     },
//     {
//       field: "product_id",
//       headerName: "Product Id",
//       type: "string",
//       width: colWidth,
//       editable: true,
//       valueGetter: (params) => params.row.product_id._id || "",
//     },
//     {
//       field: "size_id",
//       headerName: "Size",
//       width: colWidth,
//       align: "left",
//       headerAlign: "left",
//       editable: true,
//       type: "singleSelect",
//       valueOptions: sizes?.map((item) => item?.name),
//       valueGetter: (params) => params.row.size_id?.name || "",
//     },
//     {
//       field: "color_id",
//       headerName: "Color Id",
//       width: colWidth,
//       align: "left",
//       headerAlign: "left",
//       editable: true,
//       type: "singleSelect",
//       valueOptions: colors?.map((item) => item?.name),
//       valueGetter: (params) => params.row.color_id?.name || "",
//     },
//     {
//       field: "image_url",
//       headerName: "Image Url",
//       type: "string",
//       width: colWidth,
//       align: "left",
//       headerAlign: "left",
//       editable: true,
//     },
//     {
//       field: "stock",
//       headerName: "Stock",
//       type: "string",
//       width: colWidth,
//       align: "left",
//       headerAlign: "left",
//       editable: true,
//     },
//     {
//       field: "isDefault",
//       headerName: "isDefault",
//       width: colWidth,
//       align: "left",
//       headerAlign: "left",
//       editable: true,
//       type: "singleSelect",
//       valueOptions: ["true", "false"],
//       valueGetter: (params) => params.row.isDefault || "",
//     },
//     {
//       field: "createdAt",
//       headerName: "Created Date",
//       type: "date",
//       width: colWidth,
//       editable: false,
//       valueGetter: (params) => new Date(params.row.updatedAt),
//     },
//     {
//       field: "updatedAt",
//       headerName: "Updated Date",
//       type: "date",
//       width: colWidth,
//       editable: false,
//       valueGetter: (params) => new Date(params.row.updatedAt),
//     },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Actions",
//       width: colWidth,
//       cellClassName: "actions",
//       getActions: ({ id }) => {
//         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

//         if (isInEditMode) {
//           return [
//             <GridActionsCellItem
//               icon={<SaveIcon />}
//               label="Save"
//               sx={{
//                 color: "primary.main",
//               }}
//               onClick={handleSaveClick(id)}
//             />,
//             <GridActionsCellItem
//               icon={<CancelIcon />}
//               label="Cancel"
//               className="textPrimary"
//               onClick={handleCancelClick(id)}
//               color="inherit"
//             />,
//           ];
//         }

//         return [
//           <GridActionsCellItem
//             icon={<EditIcon />}
//             label="Edit"
//             className="textPrimary"
//             onClick={handleEditClick(id)}
//             color="inherit"
//           />,
//           <GridActionsCellItem
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={handleDeleteClick(id)}
//             color="inherit"
//           />,
//         ];
//       },
//     },
//   ];
//   return (
//     <Box
//       sx={{
//         height: 500,
//         // width: "100%",
//         "& .actions": {
//           color: "text.secondary",
//         },
//         "& .textPrimary": {
//           color: "text.primary",
//         },
//       }}
//     >
//       {loading && (
//         <Box
//           sx={{
//             display: "flex",
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       )}
//       <ConfirmDeletion {...{ confirmDelete, setConfirmDelete }} />
//       <CreateCDN
//         {...{
//           newRecord,
//           setNewRecord,
//           rows,
//           setRows,
//           setRowModesModel,
//           rowModesModel,
//         }}
//       />
//       <FindProduct
//         {...{
//           newRecord,
//           setNewRecord,
//           rows,
//           setRows,
//           setRowModesModel,
//           rowModesModel,
//         }}
//       />
//       <Box display={"flex"} gap={1}>
//         <Button
//           variant="contained"
//           size="small"
//           startIcon={<AddIcon />}
//           onClick={handleClick}
//           sx={{
//             mt: 1,
//             backgroundColor: "#126E82",
//             color: "white",
//             "&:hover": { backgroundColor: "#187e95" },
//           }}
//         >
//           Add New Variant
//         </Button>
//         <Button
//           variant="contained"
//           size="small"
//           startIcon={<SearchIcon />}
//           onClick={() => setNewRecord({ ...newRecord, openFindProduct: true })}
//           sx={{
//             mt: 1,
//             backgroundColor: "#126E82  ",
//             color: "white",
//             "&:hover": { backgroundColor: "#187e95" },
//           }}
//         >
//           Find Product
//         </Button>
//         <Button
//           variant="contained"
//           size="small"
//           startIcon={<ImageIcon />}
//           onClick={() => setNewRecord({ ...newRecord, openCreateCDN: true })}
//           sx={{
//             mt: 1,
//             backgroundColor: "#126E82  ",
//             color: "white",
//             "&:hover": { backgroundColor: "#187e95" },
//           }}
//         >
//           Create New CDN
//         </Button>
//       </Box>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         editMode="row"
//         rowModesModel={rowModesModel}
//         onRowModesModelChange={handleRowModesModelChange}
//         onRowEditStop={handleRowEditStop}
//         processRowUpdate={processRowUpdate}
//         onProcessRowUpdateError={(error) => {
//           //toastifyError("Error updating row. Please try again.");
//         }}
//         getRowId={(row) => row._id}
//         slots={{
//           toolbar: GridToolbar,
//         }}
//         sx={{
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: "#27496D",
//             borderTopRightRadius: 0,
//             borderTopLeftRadius: 0,
//             color: "#DAE1E7",
//           },
//           ".MuiDataGrid-iconButtonContainer": {
//             visibility: "visible",
//           },
//           ".MuiDataGrid-sortIcon": {
//             opacity: "inherit !important",
//             color: "#DAE1E7",
//           },
//           ".MuiDataGrid-toolbarContainer": {
//             backgroundColor: "#27496D",
//             borderTopRightRadius: 3,
//             borderTopLeftRadius: 3,
//           },
//           ".MuiDataGrid-toolbarContainer .MuiButtonBase-root": {
//             color: "#DAE1E7",
//           },
//         }}
//       />
//     </Box>
//   );
// }

// //************************* */
// import * as React from "react";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import { useAppSelector, useAppDispatch } from "../app/hooks";
// import { readProducts } from "../features/productSlice";
// import { Button } from "@mui/material";
// import { GridRowModesModel, GridRowModes } from "@mui/x-data-grid";
// import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 800,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
//   pt: 1,
// };

// interface IFindProductProps {
//   newRecord: INewRecord;
//   setNewRecord: React.Dispatch<React.SetStateAction<INewRecord>>;
//   rows: IVariant[];
//   setRows: React.Dispatch<React.SetStateAction<IVariant[]>>;
//   rowModesModel: GridRowModesModel;
//   setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
// }

// const FindProduct: React.FC<IFindProductProps> = ({
//   newRecord,
//   setNewRecord,
//   rows,
//   setRows,
//   setRowModesModel,
//   rowModesModel,
// }) => {
//   const { products } = useAppSelector((state) => state.product);
//   const dispatch = useAppDispatch();

//   React.useEffect(() => {
//     const fetchData = async () => {
//       await dispatch(readProducts());
//     };
//     fetchData();
//   }, [dispatch]);

//   const handleClose = () => {
//     setNewRecord({ ...newRecord, openFindProduct: false });
//   };

//   const handleClick = (row: any) => {
//     setNewRecord({ ...newRecord, selectedProductID: row.id });
//   };

//   const handleAddProductID = () => {
//     const oldTempId = rows.find((item) => item._id.slice(0, 5) === "temp-");
//     if (oldTempId) {
//       Promise.all([
//         setRows((oldRows) => oldRows.filter((row) => row !== oldTempId)),
//         setRowModesModel({
//           ...rowModesModel,
//           [oldTempId._id]: {
//             mode: GridRowModes.View,
//             ignoreModifications: true,
//           },
//         }),
//       ]).then(() => {
//         const tempId = "temp-" + Date.now().toString();

//         setRows((oldRows) => [
//           ...oldRows,
//           {
//             ...newRecord.values,
//             _id: tempId,
//             product_id: { _id: newRecord.selectedProductID },
//           } as any,
//         ]);

//         setRowModesModel((oldModel) => ({
//           ...oldModel,
//           [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "size_id" },
//         }));
//       });
//       setNewRecord({
//         ...newRecord,
//         values: {
//           ...newRecord.values,
//           product_id: { _id: newRecord.selectedProductID },
//         },
//         openFindProduct: false,
//       });
//     }
//   };
//   const columns: GridColDef[] = [
//     { field: "_id", headerName: "ID", width: 210 },
//     { field: "name", headerName: "Product Name", width: 200 },
//     {
//       field: "category",
//       headerName: "Main Category",
//       width: 250,
//       valueGetter: (params) =>
//         params.row.category[0]?.name +
//         "/" +
//         params.row.category[1]?.name +
//         "/" +
//         params.row.category[2]?.name,
//     },
//   ];

//   return (
//     <Modal
//       open={newRecord.openFindProduct}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style}>
//         <Box textAlign={"right"}>
//           <CancelPresentationIcon
//             sx={{
//               textAlign: "right",
//               position: "relative",
//               right: -20,
//               cursor: "pointer",
//               color: "#27496de0",
//               "&:hover": { color: "#27496d" },
//             }}
//             onClick={handleClose}
//           />
//         </Box>
//         <div style={{ height: 400, width: "100%" }}>
//           <DataGrid
//             rows={products}
//             columns={columns}
//             onRowClick={handleClick}
//             getRowId={(row) => row._id}
//             initialState={{
//               pagination: {
//                 paginationModel: { page: 0, pageSize: 5 },
//               },
//             }}
//             pageSizeOptions={[5, 10]}
//             sx={{
//               "& .MuiDataGrid-columnHeaders": {
//                 backgroundColor: "#27496d",
//                 color: "white",
//               },
//               ".MuiDataGrid-columnSeparator": {
//                 visibility: "visible",
//               },
//               ".MuiDataGrid-iconButtonContainer": {
//                 visibility: "visible",
//               },
//               ".MuiDataGrid-sortIcon": {
//                 opacity: "inherit !important",
//               },
//               ".MuiSvgIcon-root": {
//                 color: "#DAE1E7",
//               },
//             }}
//           />
//         </div>
//         <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
//           <Button
//             color="error"
//             variant="outlined"
//             size="small"
//             fullWidth
//             onClick={() =>
//               setNewRecord({ ...newRecord, openFindProduct: false })
//             }
//           >
//             Cancel
//           </Button>
//           <Button
//             color="success"
//             variant="outlined"
//             size="small"
//             fullWidth
//             disabled={!Boolean(newRecord.selectedProductID)}
//             onClick={handleAddProductID}
//           >
//             Add Product ID
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default FindProduct;
// //******************************* */
// import React, { ChangeEvent, useState } from "react";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { VisuallyHiddenInput } from "../helpers/styles";
// import uploadToCloudinary from "../helpers/uploadToCloudinary";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import { Divider, Grid, Skeleton } from "@mui/material";
// import { GridRowModesModel, GridRowModes } from "@mui/x-data-grid";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "1px solid #00909e",
//   borderRadius: 1,
//   boxShadow: 24,
// };

// interface ICreateCDNProps {
//   newRecord: INewRecord;
//   setNewRecord: React.Dispatch<React.SetStateAction<INewRecord>>;
//   rows: IVariant[];
//   setRows: React.Dispatch<React.SetStateAction<IVariant[]>>;
//   rowModesModel: GridRowModesModel;
//   setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
// }
// const CreateCDN: React.FC<ICreateCDNProps> = ({
//   newRecord,
//   setNewRecord,
//   rows,
//   setRows,
//   setRowModesModel,
//   rowModesModel,
// }) => {
//   const handleClose = () =>
//     setNewRecord({ ...newRecord, openCreateCDN: false });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       setSelectedFile(files[0]);
//     }
//   };

//   const handleCreateCDN = async () => {
//     const link = await uploadToCloudinary(selectedFile);
//     if (link.name === "AxiosError") {
//       setNewRecord({
//         ...newRecord,
//         error: "CDN link cannot be created. Check your network connection.",
//       });
//     } else {
//       setNewRecord({ ...newRecord, CDNLink: link });
//     }
//   };

//   const handleAddLink = () => {
//     const oldTempId = rows.find((item) => item._id.slice(0, 5) === "temp-");
//     if (oldTempId) {
//       Promise.all([
//         setRows((oldRows) => oldRows.filter((row) => row !== oldTempId)),
//         setRowModesModel({
//           ...rowModesModel,
//           [oldTempId._id]: {
//             mode: GridRowModes.View,
//             ignoreModifications: true,
//           },
//         }),
//       ]).then(() => {
//         const tempId = "temp-" + Date.now().toString();

//         setRows((oldRows) => [
//           ...oldRows,
//           {
//             ...newRecord.values,
//             _id: tempId,
//             image_url: newRecord.CDNLink,
//           } as any,
//         ]);

//         setRowModesModel((oldModel) => ({
//           ...oldModel,
//           [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "stock" },
//         }));
//       });
//       setNewRecord({
//         ...newRecord,
//         values: {
//           ...newRecord.values,
//           image_url: newRecord.CDNLink,
//         },
//         openCreateCDN: false,
//       });
//     }
//   };

//   return (
//     <Modal
//       open={newRecord.openCreateCDN}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style}>
//         <Typography
//           variant="body1"
//           sx={{ bgcolor: "#00909e", color: "white", px: 1, py: 0.3 }}
//         >
//           Creating CDN Link
//         </Typography>
//         <Card sx={{ maxWidth: 400, boxShadow: 0, p: 2 }}>
//           <Grid container spacing={1} alignItems={"center"}>
//             <Grid item xs={4}>
//               <Button
//                 component="label"
//                 size="small"
//                 endIcon={<CloudUploadIcon />}
//                 variant="text"
//                 sx={{ color: "#00909e", py: 0.8 }}
//               >
//                 Image File
//                 <VisuallyHiddenInput
//                   type="file"
//                   accept="image/*"
//                   onChange={handleChange}
//                 />
//               </Button>
//             </Grid>
//             <Grid item xs={8}>
//               <Box
//                 sx={{
//                   width: "100%",
//                   height: 50,
//                   bgcolor: "#00919e1e",
//                   borderTopLeftRadius: 5,
//                   borderTopRightRadius: 5,
//                   px: 1,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography variant="body2" fontSize={13}>
//                   {selectedFile
//                     ? selectedFile.name.slice(0, 70)
//                     : "No file chosen..."}
//                   {selectedFile && selectedFile.name.length > 69 && "..."}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//           <Grid container spacing={1}>
//             <Grid item xs={4}>
//               <Divider />
//               <Button
//                 component="label"
//                 size="small"
//                 disabled
//                 variant="text"
//                 sx={{ color: "#00909e !important", py: 0.8 }}
//               >
//                 Image Preview
//               </Button>
//             </Grid>
//             <Grid item xs={8}>
//               {selectedFile ? (
//                 <CardMedia
//                   sx={{ height: 120 }}
//                   component="img"
//                   alt="uploadedimage"
//                   image={URL.createObjectURL(selectedFile)}
//                 />
//               ) : (
//                 <Skeleton
//                   sx={{ height: 130 }}
//                   animation="wave"
//                   variant="rectangular"
//                 />
//               )}
//             </Grid>
//           </Grid>
//           <Grid container spacing={1} alignItems={"center"}>
//             <Grid item xs={4}>
//               <Divider sx={{ position: "relative", top: -7 }} />

//               <Button
//                 component="label"
//                 size="small"
//                 variant="text"
//                 sx={{ color: "#00909e", py: 0.8 }}
//                 onClick={handleCreateCDN}
//               >
//                 Create CDN
//               </Button>
//             </Grid>
//             <Grid item xs={8}>
//               <Box
//                 sx={{
//                   width: "100%",
//                   height: 50,
//                   bgcolor: "#00919e1e",
//                   borderBottomLeftRadius: 5,
//                   borderBottomRightRadius: 5,
//                   px: 1,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography variant="body2" fontSize={13}>
//                   {newRecord.CDNLink
//                     ? newRecord.CDNLink
//                     : "Click button to create CDN link."}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//           <CardActions sx={{ justifyContent: "center", mt: 1 }}>
//             <Button
//               color="error"
//               variant="outlined"
//               size="small"
//               fullWidth
//               onClick={() =>
//                 setNewRecord({ ...newRecord, openCreateCDN: false })
//               }
//             >
//               Cancel
//             </Button>
//             <Button
//               color="success"
//               variant="outlined"
//               size="small"
//               fullWidth
//               disabled={
//                 !newRecord.CDNLink || newRecord.CDNLink === "AxiosError"
//               }
//               onClick={handleAddLink}
//             >
//               Add CDN Link
//             </Button>
//           </CardActions>
//         </Card>
//       </Box>
//     </Modal>
//   );
// };

// export default CreateCDN;
import React from "react";

const Sales = () => {
  return <div>Sales</div>;
};

export default Sales;
