const db = require('./../db')

async function getChatsOf(username) {
    // returns every chat if username in members + sorted (descending)
    return await db.collection('chats').find({
        members: username 
    }).sort({lastActivation: -1}).toArray()
}

async function isOwner(username, chatID) {
    return await db.collection('chats').findOne({
        _id: chatID,
        owner: username
    }) 
}

// returns null when there isn't any chats with these exact members
async function Findchat(new_members) {
    return await db.collection('chats').findOne({
        // all new members are in this document
        members: {
            $all: new_members
        },
        // the new document members length is equel to this documents
        $expr: {
            $eq: [{$size: "members"}, new_members.length]
        }
    })
}

async function create(chat) {
    db.collection('chats').insertOne(chat)
}



//export
module.exports = {
    getChatsOf,
    isOwner,
    Findchat,
    create,
}