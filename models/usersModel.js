const db = require('./../db')
const collection = db.collection('users');



async function findByUsername(username)
{
    return await collection.findOne({username: username});
}

async function Create(userData) 
{
    await collection.insertOne(userData);
}

async function updateByUsername(currentUsername, updatedData) 
{
    return await collection.updateOne({ username: currentUsername }, { $set: updatedData });
}

async function deleteByUsername(username) 
{
    return await collection.deleteOne({ username: username });
}



//export
module.exports = 
{
    findByUsername,
    Create,
    updateByUsername,
    deleteByUsername,

}