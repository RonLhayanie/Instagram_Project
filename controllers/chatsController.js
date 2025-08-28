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

router.post('/isOwner', async (req, res) => {
    try {
        const isOwner = await chats.isOwner(req.body.username, req.body.id)
        res.json({isOwner})
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/createIfNotExists', async (req, res) => {
    try {
        const {chat} = req.body
        const foundChat = chats.Findchat(chat.members)
        if(!foundChat) {
            chats.create(chat)
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

module.exports = router