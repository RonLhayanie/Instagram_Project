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




async function toggleLike(postId, username) {
  const post = await collection.findOne({ _id: new ObjectId(postId) });
  if (!post) throw new Error('Post not found');

  const likes = post.likes || [];
  const hasLiked = likes.includes(username);

  let updatedLikes;
  if (hasLiked) {
    // אם כבר סימן לייק - מסירים
    updatedLikes = likes.filter(u => u !== username);
  } else {
    // אם לא סימן - מוסיפים
    updatedLikes = [...likes, username];
  }

  // עדכון הפוסט בבסיס הנתונים
  await collection.updateOne(
    { _id: new ObjectId(postId) },
    { $set: { likes: updatedLikes } }
  );

  return { liked: !hasLiked, likesCount: updatedLikes.length };
}



module.exports = { 
  Create,
  getAllPosts,
  getUserAvgStats,
  toggleLike
};
