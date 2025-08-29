const express = require('express')
const router = express.Router()
const chats = require('./../models/chatsModel')

router.post('/getArray', async (req, res) => {
    try {
        
        const { username } = req.body
        const AccountChats = await chats.getChatsOf(username)
        res.json(AccountChats)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
    
})

router.post('/findById', async (req, res) => {
    try {
        const { _id } = req.body
        const chat = await chats.findByID(_id)
        res.json(chat)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/createIfNotExists', async (req, res) => {
    try {
        const chat = req.body
        const foundChat = await chats.Findchat(chat.members)

        if(!foundChat) {
            await chats.create(chat)
            res.json({
                chat: chat,
                found: false
            })
        }

        else {
            res.json({
                chat: foundChat,
                found: true
            })
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

})

router.patch('/changeName', async (req, res) => {
    try { 
        const new_name = req.body.new_name
        const _id = req.body._id
        const updateResults = await chats.updateName(_id, new_name)
        res.json(updateResults)
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router