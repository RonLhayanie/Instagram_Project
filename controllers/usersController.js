const express = require('express');
const router = express.Router();
const usersModel = require('./../models/usersModel');



//create a new account
router.post('/createAccount', async (req, res) => {
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
        };

        // insert to mongo
        const created = await usersModel.Create(newUser);

        //return the created user
        const userFromDb = await usersModel.findByUsername(username);
        res.status(201).json(newUser);

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


router.post('/getAvatarByUsername', async (req, res) => {
    try {
        const { username } = req.body 
        const user = await usersModel.findByUsername(username)
        res.json({
            avatar: user.profilePic
        })
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

})

router.post('/getFullnameByUsername', async (req, res) => {
    try {
        
        const { username } = req.body 
        const user = await usersModel.findByUsername(username)
        res.json({
            fullname: user.fullName
        })
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

})

router.post('/getLastseenByUsername', async (req, res) => {
    try {    
        const { username } = req.body 
        const user = await usersModel.findByUsername(username)
        res.json({
            date: user.lastSeen
        })
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/search', async (req, res) => {
    try {
        const search_string = req.body.search_string
        const results = await usersModel.search(search_string)
        res.json(results)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})





module.exports = router;
