import React, { useState, useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import RichTextEditor from './RichTextEditor';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddCategory = () => {
    if (currentCategory && !categories.includes(currentCategory)) {
      setCategories([...categories, currentCategory]);
      setCurrentCategory('');
    }
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/posts', {
        title,
        content,
        excerpt,
        categories,
        tags,
        status,
        isFeatured
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate(`/post/${response.data.slug}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Please login to create a post</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Create New Post
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your post content here..."
          />

          <TextField
            fullWidth
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 3, mt: 3 }}
            helperText="Brief summary of your post (optional)"
          />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Category"
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                size="small"
              />
              <Button variant="outlined" onClick={handleAddCategory}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={() => handleRemoveCategory(category)}
                  color="primary"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                size="small"
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
            }
            label="Featured Post"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!title || !content}
            >
              {status === 'draft' ? 'Save Draft' : 'Publish Post'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost;