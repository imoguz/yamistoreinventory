import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { GridDeleteIcon } from "@mui/x-data-grid";

interface IConfirmDeleteProps {
  confirmDelete: IConfirmDelete;
  setConfirmDelete: React.Dispatch<React.SetStateAction<IConfirmDelete>>;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 12,
  p: 4,
};

const ConfirmDeletion: React.FC<IConfirmDeleteProps> = ({
  confirmDelete,
  setConfirmDelete,
}) => {
  const handleClose = () => {
    setConfirmDelete({ ...confirmDelete, open: false });
  };

  const handleDelete = async () => {
    setConfirmDelete({ ...confirmDelete, isDelete: true });
  };

  return (
    <div>
      <Modal
        open={confirmDelete.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box textAlign={"center"}>
            <GridDeleteIcon
              sx={{
                color: "red",
                fontSize: 30,
                outline: 3,
                borderRadius: 5,
                outlineOffset: 5,
              }}
            />

            <Typography
              variant="body1"
              fontSize={24}
              fontWeight={"bolder"}
              gutterBottom
            >
              Are you sure?
            </Typography>
          </Box>

          <Typography variant="body1" mb={3}>
            Do you really want to delete this {confirmDelete.model} record? This
            process cannot be undone.
          </Typography>

          <Box display={"flex"} justifyContent={"center"} gap={2}>
            <Button
              variant="contained"
              onClick={handleClose}
              autoFocus
              color="success"
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleDelete} color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmDeletion;
