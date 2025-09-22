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
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import {
  Person,
  Add,
  ExitToApp,
  AccountCircle,
  Edit,
  Visibility,
  Create
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const res = await API.get("/auth/me");
        setMe(res.data);
        
        // Fetch user's posts
        const postsRes = await API.get("/posts/my-posts");
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleViewPost = (slug) => {
    navigate(`/post/${slug}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BlogSpace
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Add />}
            onClick={handleCreatePost}
            sx={{ mr: 2 }}
          >
            New Post
          </Button>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <AccountCircle sx={{ mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 2 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={500}>
          <Paper
            elevation={8}
            sx={{
              p: isMobile ? 3 : 4,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              textAlign: "center",
              mb: 4
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
              Welcome, {me ? me.name : user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {me ? me.email : user?.email}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={handleCreatePost}
              startIcon={<Add />}
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
                },
                mr: 2
              }}
            >
              Create Post
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={() => navigate('/profile')}
              sx={{
                py: 1.2,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none"
              }}
            >
              Edit Profile
            </Button>
          </Paper>
        </Fade>

        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3, color: "primary.main" }}>
          Your Blog Posts
        </Typography>

        {loading ? (
          <Typography>Loading your posts...</Typography>
        ) : posts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Create sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't created any posts yet
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreatePost}
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item key={post._id} xs={12} md={6} lg={4}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={post.status} 
                        color={post.status === 'published' ? 'success' : 'default'} 
                        size="small" 
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.excerpt || 'No excerpt available'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {post.categories && post.categories.slice(0, 3).map((category) => (
                        <Chip 
                          key={category} 
                          label={category} 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {post.readTime} min read
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.views} views
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<Edit />}
                      onClick={() => handleEditPost(post._id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<Visibility />}
                      onClick={() => handleViewPost(post.slug)}
                    >
                      View
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