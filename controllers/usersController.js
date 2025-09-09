const express = require('express');
const router = express.Router();
const usersModel = require('./../models/usersModel');
const { error } = require('console');





//Use if need to add a field to users
/*
async function initUsers() {
    await usersModel.addFollowingAndFollowersToExistingUsers();
    console.log("All users initialized with followers & following arrays.");
}

initUsers(); // קורה פעם אחת בהתחלת הריצה
*/








//create a new account
router.post('/createAccount', async (req, res) => {
    console.log("Request body:", req.body);

    try{
        const { username, password, fullName, email, phone, birthDate } = req.body;

        //check if already exists
        const existingUser = await usersModel.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // User's fields
        const newUser = {
            username,
            password,
            fullName,
            email,
            phone,
            birthDate,

            // adding default fields
            bio: "",
            profilePic: "https://cdn-icons-png.flaticon.com/512/12225/12225935.png",
            posts: [],
            saved: [],
            lastSeen: new Date(),
            hasThreads: true,
            following: [],
            followers: []
        };

        // insert to mongo
        await usersModel.Create(newUser);
        res.status(201).json({ message: "User created successfully" });



    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }


});

router.post('/login', async (req,res) => {
    try
    {
        const { username, password } = req.body;
        const existingUser1 = await usersModel.findByUsername(username);
        if(!existingUser1)
        {
            res.status(401).json();
            return;
        }
        if(password == existingUser1.password)
        {
            res.status(200).json();
            return;
        }
        res.status(400).json();
        return;
    }
    catch(err)
    {
        res.status(400).json();
    }
})

//check if username is available or not
router.post('/check-username', async (req, res) => {
    console.log("username sent:", req.body);
    try {
        const { username } = req.body;
        const existingUser = await usersModel.findByUsername(username);
        console.log("existing: ", existingUser);

        if (existingUser) {
            return res.json({ available: false });
        }
        return res.json({ available: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/getAvatarByUsername', async (req, res) => {
    try {
        const { username } = req.body 
        const user = await usersModel.findByUsername(username)
        res.json({
            avatar: user.profilePic
        })
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

})

router.post('/getFullnameByUsername', async (req, res) => {
    try {
        
        const { username } = req.body 
        const user = await usersModel.findByUsername(username)
        res.json({
            fullname: user.fullName
        })
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

})

router.post('/getLastseenByUsername', async (req, res) => {
    try {    
        const { username } = req.body 
        const user = await usersModel.findByUsername(username)
        res.json({
            date: user.lastSeen
        })
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/search', async (req, res) => {
    try {
        const search_string = req.body.search_string
        const results = await usersModel.search(search_string)
        res.json(results)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})


router.post('/searchByFullnameAndUsername', async (req, res) => {
    try {
        const search_string = req.body.search_string;
        const currentUser = req.body.currentUser; // המשתמש הנוכחי שולח את השם שלו

        console.log("search body:", req.body); // 👈 לוג לבדיקה

        if (!currentUser) {
            return res.status(400).json({ error: "Missing currentUser" });
        }

        const results = await usersModel.searchByFullnameAndUsername(search_string);

        // קבלת המידע של המשתמש הנוכחי (מערך following)
        const currentUserData = await usersModel.findByUsername(currentUser);
        const followingSet = new Set(currentUserData.following || []);

        // הוספת שדה isFollowing לכל משתמש בתוצאה
        const enrichedResults = results.map(user => ({
            ...user,
            isFollowing: followingSet.has(user.username)
        }));

        res.json(enrichedResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})


// get user by username
router.get('/getByUsername/:username', async (req, res) => {
    try {
        const username = decodeURIComponent(req.params.username); // מפענח את ה־%20 חזרה לרווח
        const user = await usersModel.findByUsername(username);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



// update user profile
router.post('/updateProfile', async (req, res) => {
    try {
        const {
            currentUsername,
            username,
            fullName,
            bio,
            email,
            phone,
            profilePic,
            password, 
            hasThreads
        } = req.body;

        // קבלת הנתונים הקיימים של המשתמש
        const existingUser = await usersModel.findByUsername(currentUsername);
        if (!existingUser) {
            return res.json({ success: false, message: 'User not found' });
        }

        // יוצרים את האובייקט עם הערכים החדשים בלבד
        const updatedData = {
            username,
            fullName,
            bio,
            email,
            phone,
            profilePic,
            password,
            hasThreads
        };

        // עדכון רק השדות שב-updatedData, לא נוגעים ב-followers ו-following
        const result = await usersModel.updateByUsername(currentUsername, updatedData);

        if (result.matchedCount === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Server error' });
    }
});



// DELETE user by username
router.delete('/delete/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await usersModel.deleteByUsername(username);

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // כאן אפשר למחוק גם פוסטים, תגובות או נתונים קשורים אם יש
        // await postsModel.deleteMany({ author: username });
                // הסרת המשתמש ממערכי followers של משתמשים אחרים
        await usersModel.updateMany(
            { followers: username },        // כל מי שמעקבים אחרי המשתמש הזה
            { $pull: { followers: username } } // הסר את השם ממערך ה-followers
        );

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});



// search users by part of username
// search users
router.get('/search/:search_string', async (req, res) => {
    try {
        const { search_string } = req.params;
        const results = await usersModel.search(search_string);

        // results = [{ username: "eyal" }, { username: "daniel" } ...]
        const enrichedResults = [];
        for (const r of results) {
            const user = await usersModel.findByUsername(r.username);
            if (user) {
                enrichedResults.push({
                    username: user.username,
                    fullName: user.fullName,
                    profilePic: user.profilePic
                });
            }
        }

        res.json(enrichedResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});






// FOLLOW user
router.post('/follow', async (req, res) => {
    try {
        const { currentUser, targetUser } = req.body;

        if (!currentUser || !targetUser) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        await usersModel.followUser(currentUser, targetUser);
        res.status(200).json({ message: "Followed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to follow user" });
    }
});

// UNFOLLOW user
router.post('/unfollow', async (req, res) => {
    try {
        const { currentUser, targetUser } = req.body;

        if (!currentUser || !targetUser) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        await usersModel.unfollowUser(currentUser, targetUser);
        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unfollow user" });
    }
});

module.exports = router;

