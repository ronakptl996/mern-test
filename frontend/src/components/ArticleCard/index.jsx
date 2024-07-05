import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { capitalizeFirstLetter } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const ArticleCard = ({
  title,
  description,
  category,
  createdAt,
  _id,
  createdBy,
}) => {
  // Edit Modal useState
  const [open, setOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    title: "",
    description: "",
    articleId: "",
  });

  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);

  const handleClickOpen = ({ title, description, articleId }) => {
    setOpen(true);
    setModalForm({
      title,
      description,
      articleId,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setModalForm({
      title: "",
      description: "",
      articleId: "",
    });
  };

  // Handle Edit
  const handleEdit = async () => {
    try {
      const { title, description, articleId } = modalForm;

      if ([title, description, articleId].some((field) => field == "")) {
        alert("Please, fill edit article field");
        return;
      }

      dispatch(setLoading(true));
      const result = await fetch(`/api/article/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalForm),
        credentials: "include",
      });

      const response = await result.json();

      if (response.success) {
        toast.success(response.message);
        handleClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    dispatch(setLoading(true));
    try {
      const result = await fetch(`/api/article/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const response = await result.json();

      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {/* Dialog Form */}
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Edit Article Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setModalForm((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }));
            }}
            value={modalForm.title}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            multiline
            onChange={(e) => {
              setModalForm((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }));
            }}
            value={modalForm.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        sx={{ maxWidth: 345, m: 2, boxShadow: 3, "&:hover": { boxShadow: 6 } }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <Typography variant="h5" component="div" gutterBottom>
                {title}
              </Typography>
            </Grid>
            {loggedInUser._id === createdBy._id && (
              <Grid item xs={2}>
                <Button
                  size="small"
                  onClick={() =>
                    handleClickOpen({ title, description, articleId: _id })
                  }
                >
                  Edit
                </Button>
              </Grid>
            )}
          </Grid>
          <Typography variant="body2" color="text.secondary">
            Category: {capitalizeFirstLetter(category)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description.length > 200
              ? `${description.substring(0, 200)}...`
              : description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Typography variant="body2" color="text.secondary">
                  Created by: {createdBy?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              {loggedInUser._id === createdBy._id && (
                <Grid item xs={2}>
                  <Button size="small" onClick={() => handleDelete(_id)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ArticleCard;
