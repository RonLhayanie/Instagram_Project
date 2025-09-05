const connectDB = require('./../db');
const collection = connectDB.collection('posts');

async function Create(post) {
  await collection.insertOne(post);
}
async function getAllPosts() {
  return await collection.find().toArray();
}

module.exports = { 
  Create,
  getAllPosts
};
