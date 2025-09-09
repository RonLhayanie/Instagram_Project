const connectDB = require('./../db');
const collection = connectDB.collection('posts');
const { ObjectId } = require('mongodb');


async function Create(post) {
  await collection.insertOne(post);
}
async function getAllPosts() {
  return await collection.find().toArray();
}

async function getFriendsPosts(currentUser) {
  // all the groups containing currentUser and all the user currentUser follows
  const currentUserGroups = await  connectDB.collection('chats').find({
    members: currentUser
  }).toArray()

  const currentUserFriends = await connectDB.collection('users').find({
    followers: currentUser
  }).toArray()


   // all the username from friends and group
  let totalGroupMembers = currentUserGroups.map(chat => chat.members)
  let totalMembers = []
  totalGroupMembers.forEach(members => {
    totalMembers = [...totalMembers, ...members]
  })
  const totalFriends = currentUserFriends.map(user => user.username)

  // remove duplicates
  const distinctUsers = new Set([...totalFriends, ...totalMembers])

  // sum up all the posts of the usernames
  let posts = []
  for(const username of distinctUsers) {
    const newPosts = await collection.find({
      username: username
    }).toArray()
    posts = [...posts, ...newPosts]
  }

  return posts
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







async function deletePost(postId) {
  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid post ID');
    }

    const result = await collection.deleteOne({ _id: new ObjectId(postId) });
    if (result.deletedCount === 0) {
      throw new Error('Post not found');
    }

    return result;
  } catch (err) {
    console.error('Error in delete:', err.message);
    throw err;
  }
}






//get stats for graph
async function getUserAvgStats(username) {
  const posts = await collection.find({ username }).toArray();

  if (!posts.length) {
    return { avgLikes: 0, avgComments: 0 };
  }

  let totalLikes = 0;
  let totalComments = 0;

  posts.forEach(post => {
    totalLikes += (post.likes || []).length;
    totalComments += (post.comments || []).length;
  });

  return {
    avgLikes: totalLikes / posts.length,
    avgComments: totalComments / posts.length
  };
}



module.exports = { 
  Create,
  getAllPosts,
  getFriendsPosts,
  getUserAvgStats,
  toggleLike,
  findById,
  update,
  getFilteredPosts,
  deletePost
};




