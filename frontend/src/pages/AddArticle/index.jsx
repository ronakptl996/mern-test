import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { articleSchema } from "../../Schemas";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { debounce } from "../../utils";

const AddArticle = () => {
  const [slugExists, setSlugExists] = useState(false);

  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    description: "",
    category: "",
    slug: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      validationSchema: articleSchema,
      initialValues,
      onSubmit: async (values) => {
        console.log({ values });
        await handleAddArticle(values);
      },
    });

  const handleAddArticle = async (data) => {
    console.log(data);
    try {
      dispatch(setLoading(true));
      const result = await fetch(`/api/article/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const response = await result.json();

      console.log({ response });
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong add article!!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const checkSlug = async (slug) => {
    if (slug) {
      try {
        const result = await fetch(`/api/article/checkSlug?slug=${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const response = await result.json();

        if (!response.success) {
          setSlugExists(true);
        } else {
          setSlugExists(false);
        }
      } catch (error) {
        console.error("Error checking slug:", error);
      }
    }
  };

  const debouncedCheckSlug = useCallback(debounce(checkSlug, 500), []);

  useEffect(() => {
    debouncedCheckSlug(values.slug);
  }, [values.slug, debouncedCheckSlug]);

  return (
    <>
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: 600 },
          margin: "auto",
          mt: 5,
          p: { xs: 2, sm: 3 },
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && errors.title ? true : false}
              helperText={touched.title && errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              minRows={2}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && errors.description ? true : false}
              helperText={touched.description && errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={touched.category && Boolean(errors.category)}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                label="Category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="businessmen">Businessmen</MenuItem>
                <MenuItem value="positions">Positions</MenuItem>
              </Select>
              {touched.category && errors.category ? (
                <FormHelperText>{errors.category}</FormHelperText>
              ) : null}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="slug"
              label="Slug"
              name="slug"
              value={values.slug}
              onChange={handleChange}
              onBlur={handleBlur}
              error={slugExists || (touched.slug && Boolean(errors.slug))}
              helperText={
                slugExists ? "Slug already exists" : touched.slug && errors.slug
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AddArticle;
