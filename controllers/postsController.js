const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const sanitize = require('mongo-sanitize'); // להתקנה: npm install mongo-sanitize

let collection;

// מחברים למסד נתונים
connectDB()
    .then(db => {
        collection = db.collection('posts');
        console.log('✅ Connected to posts collection');
    })
    .catch(err => {
        console.error('❌ Failed to connect to database:', err);
    });

// יצירת פוסט חדש
router.post('/', async (req, res) => {
    try {
        if (!collection) {
            return res.status(503).json({
                success: false,
                message: 'Service unavailable: Database connection not established',
            });
        }

        // אימות בסיסי
        const { username, text } = req.body;
        if (!username || !text) {
            return res.status(400).json({
                success: false,
                message: 'Username and text are required',
            });
        }

        // סניטיזציה של הנתונים
        const postData = {
            username: sanitize(req.body.username),
            avatar: sanitize(req.body.avatar || ''),
            image: sanitize(req.body.image || ''),
            likes: parseInt(req.body.likes) || 0,
            text: sanitize(req.body.text),
            commentsCount: parseInt(req.body.commentsCount) || 0,
            time: sanitize(req.body.time || new Date().toLocaleTimeString()),
            date: sanitize(req.body.date || new Date().toISOString()),
            createdAt: new Date(),
        };

        const result = await collection.insertOne(postData);
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            id: result.insertedId,
        });
    } catch (err) {
        console.error('❌ Error creating post:', err);
        res.status(500).json({
            success: false,
            message: `Failed to create post: ${err.message}`,
        });
    }
});

module.exports = router;