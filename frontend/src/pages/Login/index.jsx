import React, { useState } from "react";
import {
  Avatar,
  TextField,
  Button,
  CssBaseline,
  FormControlLabel,
  FormControl,
  InputLabel,
  Grid,
  Link,
  Checkbox,
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSchema } from "../../Schemas";
import {
  setIsLoggedIn,
  setLoading,
  setLoggedInUserDetails,
} from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      validationSchema: signInSchema,
      initialValues: initialValues,
      onSubmit: async (values) => {
        console.log({ values });
        await handleLogin(values);
      },
    });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (data) => {
    try {
      dispatch(setLoading(true));
      let result = await fetch(`/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      let response = await result.json();

      console.log({ response });
      if (response.success) {
        toast.success(response.message);
        dispatch(setLoggedInUserDetails(data.data));
        navigate("/");
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
                Password
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
