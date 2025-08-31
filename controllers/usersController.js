const express = require('express');
const router = express.Router();
const usersModel = require('./../models/usersModel');



//create a new account
router.post('/createAccount', async (req, res) => {
    console.log("Request body:", req.body); // <--- הוסף את זה

    try{
        const { username, password, fullName, email, phone, birthDate } = req.body;

        //check if already exists
        const existingUser = await usersModel.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // User's fields
        const newUser = {
            username,
            password,
            fullName,
            email,
            phone,
            birthDate,

            // adding default fields
            bio: "",
            profilePic: "https://cdn-icons-png.flaticon.com/512/12225/12225935.png",
            posts: [],
            saved: [],
            lastSeen: new Date(),
            hasThreads: true
        };

        // insert to mongo
        await usersModel.Create(newUser);
        res.status(201).json({ message: "User created successfully" });



    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }


});



//check if username is available or not
router.post('/check-username', async (req, res) => {
    try {
        const { username } = req.body;
        const existingUser = await usersModel.findByUsername(username);

        if (existingUser) {
            return res.json({ available: false });
        }
        return res.json({ available: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



// get user by username
router.get('/getByUsername/:username', async (req, res) => {
    try {
        const { username } = req.params;  // לקח את הusername מהכתובת
        const user = await usersModel.findByUsername(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



// update user profile
router.post('/updateProfile', async (req, res) => {
    try {
        const {
            currentUsername,
            username,
            fullName,
            bio,
            email,
            phone,
            profilePic,
            password, 
            hasThreads
        } = req.body;

        const updatedUser = {
            username,
            fullName,
            bio,
            email,
            phone,
            profilePic,
            password,
            hasThreads
        };

        const result = await usersModel.updateByUsername(currentUsername, updatedUser);

        if (result.matchedCount === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Server error' });
    }
});



// DELETE user by username
router.delete('/delete/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await usersModel.deleteByUsername(username);

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // כאן אפשר למחוק גם פוסטים, תגובות או נתונים קשורים אם יש
        // await postsModel.deleteMany({ author: username });

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});


module.exports = router;
