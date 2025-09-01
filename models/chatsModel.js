const { ObjectId } = require('mongodb')
const db = require('./../db')

async function getChatsOf(username) {
    // returns every chat if username in members + sorted (descending)
    return await db.collection('chats').find({
        members: username 
    }).sort({lastSeen: -1}).toArray()
}

async function findByID(_id) {
    return await db.collection('chats').findOne({
        _id: new ObjectId(_id)
    })
}

// returns null when there isn't any chats with these exact members
async function Findchat(new_members) {
    return await db.collection('chats').findOne({
        // all new members are in this document and the sizes are the same
        members: {
            $all: new_members,
            $size: new_members.length
        },
    })
}

async function create(chat) {
    db.collection('chats').insertOne(chat)
}

async function updateName(_id, new_name) {
    return await db.collection('chats').updateOne(
       { _id: new ObjectId(_id)},
       { $set: {name: new_name}}
    )
}

//export
module.exports = {
    getChatsOf,
    findByID,
    Findchat,
    create,
    updateName,
}