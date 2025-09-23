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
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Add,
  ExitToApp,
  AccountCircle,
  Visibility,
  Create,
  ArrowBack,   // ⬅ back icon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Navbar menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/"); // redirect to Home
  };

  const handleCreateBlog = () => navigate("/create-blog");
  const handleViewBlog = (id) => navigate(`/blog/${id}`);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Navbar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BlogSpace
          </Typography>

          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={handleCreateBlog}
            sx={{ mr: 2 }}
          >
            New Blog
          </Button>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
            >
              <AccountCircle sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Welcome Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back to Home button */}
        <Box sx={{ textAlign: "left", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Back to Home
          </Button>
        </Box>

        <Fade in timeout={500}>
          <Paper
            elevation={8}
            sx={{
              p: isMobile ? 3 : 4,
              borderRadius: 3,
              textAlign: "center",
              mb: 4,
              background: "white",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
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
                mb: 2,
              }}
            >
              <Person sx={{ fontSize: 32, color: "white" }} />
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
              {user?.name ? `Welcome, ${user.name}` : "Welcome to BlogSpace"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share your thoughts, read amazing blogs, and connect with others.
            </Typography>
          </Paper>
        </Fade>

        {/* Blog Feed */}
        <Typography
          variant="h5"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 3, color: "primary.main" }}
        >
          Latest Blogs
        </Typography>

        {blogs.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Create sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No blogs yet. Be the first to write one!
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreateBlog}
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Create Blog
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item key={blog._id} xs={12} md={6} lg={4}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {blog.image && (
                      <Box
                        component="img"
                        src={blog.image}
                        alt={blog.title}
                        sx={{ width: "100%", borderRadius: 1, mb: 2 }}
                      />
                    )}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {blog.content.substring(0, 120)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(blog.createdAt).toLocaleDateString()} • By{" "}
                      {blog.author || "Anonymous"}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<Visibility />}
                      onClick={() => handleViewBlog(blog._id)}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
