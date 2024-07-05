import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  TextField,
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  Grid,
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
  Container,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signUpSchema } from "../../Schemas";
import {
  setIsLoggedIn,
  setLoading,
  setLoggedInUserDetails,
} from "../../features/auth/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    username: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      validationSchema: signUpSchema,
      initialValues: initialValues,
      onSubmit: async (values) => {
        await handleRegister(values);
      },
    });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async (data) => {
    try {
      dispatch(setLoading(true));
      const result = await fetch(`/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const response = await result.json();

      if (response.success) {
        toast.success(response.message);
        navigate("/login");
      } else {
        dispatch(setIsLoggedIn(false));
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong while login!!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && errors.username ? true : false}
              helperText={touched.username && errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email ? true : false}
              helperText={touched.email && errors.email}
            />
            <FormControl
              fullWidth
              sx={{ my: 1.5 }}
              variant="outlined"
              error={touched.password && Boolean(errors.password)}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password *
              </InputLabel>
              <OutlinedInput
                fullWidth
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched?.password && errors?.password && (
                <FormHelperText>{errors?.password}</FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/login">{"Do you have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
