import * as Yup from "yup";
import dayjs from "dayjs";

export const signInSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

export const signUpSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  username: Yup.string()
    .min(4, "Username must be at least 4 characters long")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

export const articleSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  slug: Yup.string().required("Slug is required"),
});
