import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  TextField
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  ArrowBack,
  Share,
  Comment as CommentIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { format } from 'date-fns';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/posts/${slug}`);
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await API.post(`/posts/${post._id}/like`);
      setPost(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Implement bookmark functionality
      console.log('Bookmark functionality to be implemented');
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await API.post(`/posts/${post._id}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Post not found'}</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const isLiked = user && post.likes.includes(user.id);
  const isBookmarked = false; // Implement bookmark logic

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Post Content */}
      <Paper sx={{ p: { xs: 3, md: 6 }, mb: 4 }}>
        {/* Categories */}
        <Box sx={{ mb: 3 }}>
          {post.categories.map((category) => (
            <Chip
              key={category}
              label={category}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {/* Title */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {post.title}
        </Typography>

        {/* Meta Information */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
            {post.author?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {post.author?.name || 'Unknown Author'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(post.createdAt), 'MMMM dd, yyyy')} • {post.readTime} min read
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {post.views} views
            </Typography>
          </Box>
        </Box>

        {/* Featured Image */}
        {post.featuredImage && (
          <Box sx={{ mb: 4 }}>
            <img
              src={post.featuredImage}
              alt={post.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            '& h2': { mt: 4, mb: 2, fontWeight: 600 },
            '& h3': { mt: 3, mb: 2, fontWeight: 600 },
            '& p': { lineHeight: 1.8, mb: 3 },
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px', my: 3 },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 3,
              py: 1,
              my: 3,
              fontStyle: 'italic',
              backgroundColor: 'grey.50'
            }
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={handleLike}
            color={isLiked ? 'error' : 'default'}
            size="large"
          >
            {isLiked ? <Favorite /> : <FavoriteBorder />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {post.likes?.length || 0}
            </Typography>
          </IconButton>

          <IconButton
            onClick={handleBookmark}
            color={isBookmarked ? 'primary' : 'default'}
            size="large"
          >
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>

          <IconButton onClick={handleShare} size="large">
            <Share />
          </IconButton>
        </Box>
      </Paper>

      {/* Comments Section */}
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CommentIcon sx={{ mr: 1 }} />
          Comments ({comments.length})
        </Typography>

        {/* Comment Form */}
        {user ? (
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={commentLoading || !newComment.trim()}
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        ) : (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Please login to leave a comment
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          <Box>
            {comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                    {comment.author?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600">
                      {comment.author?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ pl: 6 }}>
                  {comment.content}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Related Posts (optional) */}
      {/* You can implement related posts section here */}
    </Container>
  );
};

export default PostDetail;