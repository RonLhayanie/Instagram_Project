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





// return 20 rondomly sorted usernames which contains the search_string
// regardless of upper/lower cases
async function search20(search_string) {
    return await db.collection('users').aggregate([
        {$match: {username: {$regex: search_string, $options: 'i'}}},
        {$sample: { size: 20 } },
        {$project: {username: 1, _id: 0}}
    ]).toArray()
}

//export
module.exports = 
{
    findByUsername,
    Create,
    updateByUsername,
    deleteByUsername,

    search20,
}