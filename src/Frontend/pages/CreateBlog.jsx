import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/blogs", form);
      alert("Blog created successfully!");
      navigate("/"); // redirect back to home
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Blog
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Content"
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          multiline
          rows={6}
        />
        <TextField
          label="Image URL (optional)"
          name="image"
          value={form.image}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Blog
        </Button>
      </Box>
    </Container>
  );
};

export default CreateBlog;
