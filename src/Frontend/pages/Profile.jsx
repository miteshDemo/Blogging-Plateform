import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../utils/api";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Person,
  Edit,
  Save,
  Cancel,
  CameraAlt,
  Lock
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    avatar: ""
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get("/auth/me");
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          bio: res.data.bio || "",
          avatar: res.data.avatar || ""
        });
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await API.put("/auth/profile", formData);
      
      setProfile(response.data);
      updateUser(response.data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      username: profile?.username || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      avatar: profile?.avatar || ""
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: isMobile ? 3 : 4,
            borderRadius: 3,
            background: "white",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="700" color="primary">
              Profile
            </Typography>
            
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Left Column - Avatar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={isEditing ? formData.avatar : profile?.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: "3rem",
                      mb: 2,
                      border: "4px solid",
                      borderColor: "primary.main"
                    }}
                  >
                    {profile?.name?.charAt(0) || "U"}
                  </Avatar>
                  
                  {isEditing && (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <label htmlFor="avatar-upload">
                        <IconButton
                          component="span"
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "primary.dark"
                            }
                          }}
                        >
                          <CameraAlt />
                        </IconButton>
                      </label>
                    </>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={handleChangePassword}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Change Password
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Member since {new Date(profile?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>

            {/* Right Column - Form */}
            <Grid item xs={12} md={8}>
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "filled"}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "filled"}
                      helperText={isEditing ? "Unique username for your profile" : ""}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "filled"}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "filled"}
                      multiline
                      rows={3}
                      placeholder="Tell us about yourself..."
                      helperText={isEditing ? "A short description about yourself" : ""}
                    />
                  </Grid>

                  {isEditing && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Avatar URL"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        variant="outlined"
                        placeholder="https://example.com/avatar.jpg"
                        helperText="Or upload an image using the camera icon"
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Stats Section */}
              {!isEditing && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Typography variant="h6" gutterBottom>
                    Profile Stats
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Posts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Comments
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Likes
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Views
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Profile;