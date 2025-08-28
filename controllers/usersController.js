const express = require('express');
const router = express.Router();
const usersModel = require('./../models/usersModel');


//create a new account
router.post('/createAccount', async (req, res) => {
    try {
        const userData = req.body;

        console.log(userData);

        const existingUser = await usersModel.findByUsername(userData.username);
        if (existingUser)
        {
            return res.status(400).send('Username exists');
        }


        usersModel.Create(userData);
        res.status(200).send('User created');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating user');
    }
});

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

router.post('/search20', async (req, res) => {
    try {
        const search_string = req.body.search_string
        const results = await usersModel.search20(search_string)
        res.json(results)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})



module.exports = router;
