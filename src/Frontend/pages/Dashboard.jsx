import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../utils/api";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Person } from "@mui/icons-material";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [me, setMe] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/auth/me");
        setMe(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
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
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: 2,
                bgcolor: "primary.main",
                mb: 2
              }}
            >
              <Person sx={{ fontSize: 32, color: "white" }} />
            </Box>

            <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={1}>
              Welcome, {me ? me.name : user.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {me ? me.email : user.user.email}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={logout}
              sx={{
                py: 1.2,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 10px 16px rgba(25, 118, 210, 0.4)",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease-in-out"
                }
              }}
            >
              Logout
            </Button>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default Dashboard;
