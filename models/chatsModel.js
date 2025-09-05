const { ObjectId } = require('mongodb')
const db = require('./../db')

async function getChatsOf(username) {
    // returns every chat if username in members + sorted (descending)
    return await db.collection('chats').find({
        members: username 
    }).toArray()
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

// return 20 rondomly sorted group chats (more then 2 members) whose name contains the search_string and is not empty
// regardless of upper/lower cases
async function search(search_string) {
    const total = await db.collection('chats').countDocuments()

    return await db.collection('chats').aggregate([
        {$match: {$and: [{name: {$regex: search_string, $options: 'i'}},
                         {name: {$ne: ''}}],
                  $expr: {$gt: [{$size: "$members"}, 2]}}},
        {$sample: { size: total } },
    ]).toArray()
}

// push username to chat with _id with no duplicates
async function addMember(_id, username)  {
    return await db.collection('chats').updateOne(
        {_id: new ObjectId(_id)},
        {$push: {members: username}}
    )
}

// remove username from chat with _id with no duplicates
async function removeMember(_id, username)  {
    return await db.collection('chats').updateOne(
        {_id: new ObjectId(_id)},
        {$pull: {members: username}}
    )
}

// if owner left - set the new owner to be the viceowner and the new viceowner to be the first in members without the old viceowner
// if viceowner left - set the new viceowner to be the first in members without the owner
async function updateOwners(_id, left)  {
    if(left === "owner") {
        db.collection('chats').updateOne(
            {_id: new ObjectId(_id)},
            [{$set: {
                owner: "$viceowner",
                viceowner: {
                    $first: {
                        $filter: {
                            input: "$members",
                            cond: { $ne: ["$$this", "$viceowner"]}
                        }
                    }
                }
            }}]
        )
    }

    else {
        db.collection('chats').updateOne(
            {_id: new ObjectId(_id)},
            [{$set: {
                viceowner: {
                    $first: {
                        $filter: {
                            input: "$members",
                            cond: { $ne: ["$$this", "$owner"]}
                        }
                    }
                }
            }}]
        )
    }
}

async function deleteChat(_id) {
    db.collection('chats').deleteOne(
        {_id: new ObjectId(_id)},
    )
}

//export
module.exports = {
    getChatsOf,
    findByID,
    Findchat,
    create,
    updateName,
    search,
    addMember,
    removeMember,
    updateOwners,
    deleteChat,
}