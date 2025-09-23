import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
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
  useMediaQuery
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Create, ArrowBack } from "@mui/icons-material";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await API.post("/auth/login", values);
        login(res.data);
        resetForm();
        navigate("/dashboard");
      } catch (err) {
        alert(err.response?.data?.msg || "Login failed");
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
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={500}>
          <Paper
            elevation={8}
            sx={{
              p: isMobile ? 3 : 4,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
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
                  mb: 1.5
                }}
              >
                <Create sx={{ fontSize: 32, color: "white" }} />
              </Box>
              <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
                Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to access your dashboard
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  size="small"
                  type="email"
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

              <Box mb={2}>
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
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
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
                Login
              </Button>

              <Box textAlign="center" mt={2}>
                <Typography variant="body2" display="inline" color="text.secondary">
                  Don't have an account?{" "}
                </Typography>
                <Button
                  onClick={() => navigate("/register")}
                  color="primary"
                  sx={{ textTransform: "none", fontWeight: "600" }}
                >
                  Register
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default Login;
