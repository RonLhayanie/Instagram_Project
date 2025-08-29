const connectDB = require('./../db');

async function getUsersCollection() {
    const db = await connectDB();
    return db.collection('posts');
}

module.exports = { getUsersCollection };