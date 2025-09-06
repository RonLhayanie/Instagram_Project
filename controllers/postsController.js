const express = require('express');
const router = express.Router();
const postsModel = require('./../models/postsModel');
const multer = require('multer');
const path = require('path');

const { fileTypeFromBuffer } = require('file-type')
const fs = require('fs')

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
      likes: 0,
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

module.exports = router;
