import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  ArrowBack,
  Create,
} from "@mui/icons-material";

// Strong validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-z]+$/, "Name must contain only lowercase letters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(1, "Password must be at least 1 character")
    .max(10, "Password must be at most 10 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    )
    .required("Password is required"),
});

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await API.post("/auth/register", values);
        resetForm();
        alert("Registration successful! Please login.");
        navigate("/login");
      } catch (err) {
        alert(err.response?.data?.msg || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={500}>
          <Paper
            elevation={8}
            sx={{
              p: isMobile ? 3 : 4,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            {/* Back Button */}
            <Box textAlign="left" mb={2}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Back to Home
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  mb: 1.5,
                }}
              >
                <Create sx={{ fontSize: 32, color: "white" }} />
              </Box>
              <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
                Register
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your account to start writing and sharing your stories
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  size="small"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  size="small"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={2.5}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  size="small"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="medium"
                disabled={formik.isSubmitting}
                sx={{ py: 1.2, borderRadius: 2, fontWeight: 600, textTransform: "none" }}
              >
                Create Account
              </Button>

              <Box textAlign="center" mt={2}>
                <Typography variant="body2" display="inline" color="text.secondary">
                  Already have an account?{" "}
                </Typography>
                <Button
                  onClick={() => navigate("/login")}
                  color="primary"
                  sx={{ textTransform: "none", fontWeight: "600" }}
                >
                  Sign In
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default Register;
