const express = require('express');
const router = express.Router();
const postsModel = require('./../models/postsModel');
const multer = require('multer');
const path = require('path');

const { fileTypeFromBuffer } = require('file-type')
const fs = require('fs') 
const { ObjectId } = require('mongodb');

// הגדרת איפה Multer ישמור את הקבצים
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ודא שיצרת תיקייה uploads בספרייה הראשית
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMime = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = [".jpeg", ".jpg", ".png", ".gif", ".mp4"];

  if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } 
  else {
    cb(new Error("Only jpeg, jpg, png, gif, mp4 allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // עד 200MB במקום 50MB
});

// Create a new post עם תמונה/וידאו
router.post('/createPost', upload.single('media'), async (req, res) => {
  try {
    const { username, text, avatar } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    console.log(`/uploads/${file.filename}`)
    const buffer = await fs.promises.readFile(`uploads/${file.filename}`)
    const type = await fileTypeFromBuffer(buffer) 

    console.log(type.ext)

    const newPost = {
      username: username,
      avatar: avatar,
      image: `/uploads/${file.filename}`,
      likes: [],
      text: text || '',
      comments: [],
      time: 'Just now',
      date: new Date().toDateString(),
      type: type.mime.split('/')[0]
    };

    await postsModel.Create(newPost);
    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts
router.get('/getAllPosts', async (req, res) => {
  try {
    const posts = await postsModel.getAllPosts({ sort: { _id: -1 } }); // newest first
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get post by ID (לטעינת תגובות)
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    const post = await postsModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment to a post
router.post('/:id/add-comment', async (req, res) => {
  try {
    const { username, text } = req.body;
    const postId = req.params.id;
    console.log(`Adding comment to post ${postId}`);
    if (!ObjectId.isValid(postId)) {
      console.error(`Invalid post ID: ${postId}`);
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    if (!username || !text) {
      console.error('Missing username or text');
      return res.status(400).json({ error: 'Username and text are required' });
    }
    const post = await postsModel.findById(postId);
    if (!post) {
      console.error(`Post not found: ${postId}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    const newComment = {
      username,
      text,
      time: new Date().toISOString(),
    };
    post.comments.push(newComment);
    await postsModel.update(post);
    res.json({ message: 'Comment added successfully', comment: newComment, commentCount: post.comments.length });
  } catch (err) {
    console.error(`Error adding comment to post ${req.params.id}:`, err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});






// Get average likes and comments per post for a user
router.get('/avg-stats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const stats = await postsModel.getUserAvgStats(username);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});





// Likes
router.post('/:id/toggle-like', async (req, res) => {
  const postId = req.params.id;
  const { user } = req.body;

  try {
    const result = await postsModel.toggleLike(postId, user);
    res.json(result); // { liked: true/false, likesCount: number }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});









module.exports = router;
