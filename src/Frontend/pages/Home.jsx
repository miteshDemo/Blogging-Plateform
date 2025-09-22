import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  IconButton,
  Fab,
  Paper,
  InputBase,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Search,
  Create,
  Favorite,
  Share,
  Bookmark,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  PersonAdd,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
  },
});

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React and Material-UI",
    excerpt:
      "Learn how to create beautiful React applications using Material-UI components and theming.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "React",
    date: "May 15, 2024",
    author: "Jane Doe",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Modern Web Development Best Practices",
    excerpt:
      "Explore the latest trends and best practices in modern web development for 2024.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Web Development",
    date: "May 12, 2024",
    author: "John Smith",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Building Responsive UIs with Material-UI",
    excerpt:
      "Learn how to create responsive and accessible user interfaces using Material-UI Grid system.",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "UI/UX",
    date: "May 10, 2024",
    author: "Alice Johnson",
    readTime: "6 min read",
  },
];

const popularCategories = [
  "React",
  "JavaScript",
  "Web Development",
  "UI/UX",
  "Design",
  "Programming",
];

const BlogApp = () => {
  const navigate = useNavigate();

  const handleOpenRegisterModal = () => {
    navigate("/register");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Navigation Bar */}
        <AppBar position="static" elevation={0}>
          <Container maxWidth="lg">
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontWeight: "bold" }}
              >
                BlogSpace
              </Typography>

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                <Button color="inherit">Home</Button>
                <Button color="inherit">Categories</Button>
                <Button color="inherit">About</Button>
                <Button color="inherit">Contact</Button>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
              >
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 250,
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search articles..."
                    inputProps={{ "aria-label": "search articles" }}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <Search />
                  </IconButton>
                </Paper>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Create />}
                  sx={{ ml: 1 }}
                >
                  Write
                </Button>

                <Button
                  color="inherit"
                  startIcon={<PersonAdd />}
                  onClick={handleOpenRegisterModal}
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>

                <IconButton
                  color="inherit"
                  sx={{ display: { xs: "flex", md: "none" } }}
                >
                  <Menu />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 8,
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h1" gutterBottom>
              Welcome to BlogSpace
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Discover amazing stories, thoughts, and ideas from our community
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                mr: 2,
              }}
            >
              Start Reading
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
              onClick={handleOpenRegisterModal}
            >
              Join Now
            </Button>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Featured Posts */}
          <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
            Featured Posts
          </Typography>

          <Grid container spacing={4}>
            {blogPosts.map((post) => (
              <Grid item key={post.id} xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={post.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography gutterBottom variant="h5" component="h2">
                      {post.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {post.author[0]}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {post.author}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button size="small" color="primary">
                      Read More
                    </Button>
                    <Box>
                      <IconButton size="small">
                        <Favorite />
                      </IconButton>
                      <IconButton size="small">
                        <Bookmark />
                      </IconButton>
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Categories Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h2" gutterBottom>
              Popular Categories
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              {popularCategories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  clickable
                  variant="outlined"
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: "1rem",
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 6,
            mt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  BlogSpace
                </Typography>
                <Typography variant="body2">
                  A platform for writers and readers to share knowledge,
                  stories, and ideas.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button color="inherit">Home</Button>
                  <Button color="inherit">About</Button>
                  <Button color="inherit">Contact</Button>
                  <Button color="inherit">Privacy Policy</Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Connect With Us
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton color="inherit">
                    <Facebook />
                  </IconButton>
                  <IconButton color="inherit">
                    <Twitter />
                  </IconButton>
                  <IconButton color="inherit">
                    <Instagram />
                  </IconButton>
                  <IconButton color="inherit">
                    <LinkedIn />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4, bgcolor: "rgba(255,255,255,0.2)" }} />
            <Typography variant="body2" align="center">
              © 2025 BlogSpace. All rights reserved.
            </Typography>
          </Container>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="write"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
          }}
        >
          <Create />
        </Fab>
      </Box>
    </ThemeProvider>
  );
};

export default BlogApp;