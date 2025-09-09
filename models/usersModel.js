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



// return rondomly sorted usernames which contains the search_string
// regardless of upper/lower cases
async function search(search_string) {
    const total = await collection.countDocuments()

    return await collection.aggregate([
        {$match: {username: {$regex: search_string, $options: 'i'}}},
        {$sample: { size: total } },
        {$project: {username: 1, _id: 0}}
    ]).toArray()
}

async function searchByFullnameAndUsername(search_string)
{
    const total = await collection.countDocuments();

    return await collection.aggregate([
        {
            $match: {
                $or: [
                    { username: { $regex: search_string, $options: 'i' } },
                    { fullName: { $regex: search_string, $options: 'i' } }
                ]
            }
        },
        { $sample: { size: total } },
        { $project: { username: 1, fullName: 1, profilePic: 1, _id: 0 } }
    ]).toArray();
}




// add a user to following/followers
async function followUser(currentUsername, targetUsername) {
    // הוספה ל-following של הנוכחי
    await collection.updateOne(
        { username: currentUsername, following: { $ne: targetUsername } },
        { $push: { following: targetUsername } }
    );

    // הוספה ל-followers של המטרה
    await collection.updateOne(
        { username: targetUsername, followers: { $ne: currentUsername } },
        { $push: { followers: currentUsername } }
    );
}

// remove a user from following/followers
async function unfollowUser(currentUsername, targetUsername) {
    // הסרה מ-following של הנוכחי
    await collection.updateOne(
        { username: currentUsername },
        { $pull: { following: targetUsername } }
    );

    // הסרה מ-followers של המטרה
    await collection.updateOne(
        { username: targetUsername },
        { $pull: { followers: currentUsername } }
    );
}


//Use if need to add a field to users
/*
async function addFollowingAndFollowersToExistingUsers() {
    await collection.updateMany(
        { following: { $exists: false } },
        { $set: { following: [] } }
    );

    await collection.updateMany(
        { followers: { $exists: false } },
        { $set: { followers: [] } }
    );

    return "All existing users updated!";
}
*/


//export
module.exports = 
{
    findByUsername,
    Create,
    search,     //for chats
    updateByUsername,
    deleteByUsername,
    searchByFullnameAndUsername,
    followUser,
    unfollowUser,

//    addFollowingAndFollowersToExistingUsers

}