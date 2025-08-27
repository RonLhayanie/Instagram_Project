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




//export
module.exports = 
{
    findByUsername,
    Create

}