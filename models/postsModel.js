const connectDB = require('./../db');
const collection = connectDB.collection('posts');
const { ObjectId } = require('mongodb');


async function Create(post) {
  await collection.insertOne(post);
}
async function getAllPosts() {
  return await collection.find().toArray();
}

async function getUserAvgStats(username) 
{
  const posts = await collection.find({ username }).toArray();

  if (posts.length === 0) {
    return { avgLikes: 0, avgComments: 0 };
  }

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  return {
    avgLikes: totalLikes / posts.length,
    avgComments: totalComments / posts.length
  };
}



async function getFilteredPosts(filter = {}) 
{
  return await collection.find(filter).sort({ _id: -1 }).toArray();
}



async function toggleLike(postId, username) {
  const post = await collection.findOne({ _id: new ObjectId(postId) });
  if (!post) throw new Error('Post not found');

  const likes = post.likes || [];
  const hasLiked = likes.includes(username);

  let updatedLikes;
  if (hasLiked) {
    updatedLikes = likes.filter(u => u !== username); // מסיר לייק
  } else {
    updatedLikes = [...likes, username]; // מוסיף לייק
  }

  await collection.updateOne(
    { _id: new ObjectId(postId) },
    { $set: { likes: updatedLikes } }
  );

  return { liked: !hasLiked, likesCount: updatedLikes.length };
}

async function update(post) {
  try {
    await collection.updateOne(
      { _id: new ObjectId(post._id) },
      { $set: { comments: post.comments } }
    );
  } catch (err) {
    console.error('Error in update:', err.message);
    throw err;
  }
}

async function findById(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid post ID');
    }
    const post = await collection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (err) {
    console.error('Error in findById:', err.message);
    throw err;
  }
}








module.exports = { 
  Create,
  getAllPosts,
  getUserAvgStats,
  toggleLike,
  findById,
  update,
  getFilteredPosts
};




