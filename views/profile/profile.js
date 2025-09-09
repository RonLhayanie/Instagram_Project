//Navigation functions
function goToFeed()
{
    window.location.href = "../feed/feed.html";
}

function goToMessages()
{
    window.location.href = "../chats/chats.html";
}

function EditProfile()
{
    window.location.href = "editProfile.html";
}

// no access without currentUser
if(!localStorage.getItem('currentUser'))
    window.location.href = '../login/login.html'



// constants
const searchModel                    = document.getElementById('search-modal')
const overlay2                        = document.getElementById('overlay2')
const sidebarSearchInput             = document.getElementById('sidebar-search-input')

const AccountUsername                 = localStorage.getItem('currentUser')

const debounceSearch_searchModal     = debounce(uploadSearchResults_searchModal,     400)



// open/close search bar
document.getElementById('search-toggle').addEventListener('click', ()=> {
    searchModel.classList.toggle('search-modal-collapsed')
    overlay2.classList.toggle('hidden')

    if(overlay2.classList.contains('hidden')) {
        searchModel.style.zIndex = "2"
    }

    else {
        searchModel.style.zIndex = "5"
    }
})

// click on overlay close modals
overlay2.addEventListener('click', (event) => {
    if(!searchModel.classList.contains('search-modal-collapsed') && event.target != searchModel) 
    {
        searchModel.classList.add('search-modal-collapsed')

        searchModel.style.zIndex = '2'
        document.getElementById('sidebar').style.zIndex = '3'

        overlay2.classList.add('hidden')
    }

    else if(!newMessageModal.classList.contains('hidden') && event.target != newMessageModal)
    {
        newMessageModal.classList.add('hidden')
        overlay2.classList.add('hidden')
        overlay2.classList.remove('darken')

        currentSelctedUsers = []
    }
})

// search modal
sidebarSearchInput.addEventListener('input', () => {
    if(sidebarSearchInput.value.length > 0) {
        document.getElementById('pre-search').style.display = "none";
        document.getElementById('post-search').style.display = "block";
    }

    else {
        document.getElementById('post-search').style.display = "none";
        document.getElementById('pre-search').style.display = "block";
    }
})

// search modal x-button
document.querySelector('#sidebar-search svg').addEventListener('click', () => {
    sidebarSearchInput.value = ''

    document.getElementById('post-search').style.display = "none";
    document.getElementById('pre-search').style.display = "block";
})

// search modal search
document.getElementById('sidebar-search-input').addEventListener("input", () => {
    // erase every kind of space 
    const search_string = document.getElementById('sidebar-search-input').value.replace(/\s+/g, "");
    debounceSearch_searchModal(search_string, 400)
});

async function avatarOf(username) {
    const response = await fetch('/users/getAvatarByUsername', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username
        })
    })
    const data = await response.json() 
    return data.avatar
}

async function fullnameOf(username) {
    const response = await fetch('/users/getFullnameByUsername', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username
        })
    })
    const data = await response.json() 
    return data.fullname
}


async function renderSearchResults(searchResultData) {
    const resultsContainer = document.querySelector('#post-search ul');
    resultsContainer.innerHTML = '';

    const limitedResults = searchResultData.slice(0, 15);

    // מערך לאחסון כל ה-LI שניצור
    const liElements = [];

    for (const result of limitedResults) {
        const li = document.createElement('li');
        li.dataset.username = result.username;

        // מחכים ל-avatar ול-fullname
        const [avatarUrl, fullnameText] = await Promise.all([
            avatarOf(result.username),
            fullnameOf(result.username)
        ]);

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('pfp', 'search-result-account-pfp');
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = 'not found';
        avatarDiv.appendChild(img);

        const descDiv = document.createElement('div');
        descDiv.classList.add('search-result-account-description');
        descDiv.innerHTML = `
            <div class="search-result-account-username">${result.username}</div>
            <div class="search-result-account-fullname">${fullnameText}</div>
        `;

        const followBtn = document.createElement('button');
        followBtn.classList.add('follow-btn');
        followBtn.dataset.username = result.username;
        followBtn.textContent = result.isFollowing ? 'UNFOLLOW' : 'FOLLOW';

        if (result.isFollowing) 
        {
            followBtn.classList.add('unfollow');
        } 

        followBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const targetUser = followBtn.dataset.username;
            const action = followBtn.textContent === 'FOLLOW' ? 'follow' : 'unfollow';
            const response = await fetch(`/users/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUser: AccountUsername, targetUser })
            });
            
            
            if (response.ok) 
            {
                if (action === 'follow') 
                {
                    followBtn.textContent = 'UNFOLLOW';
                    followBtn.classList.add('unfollow');  // הוסף קלאס לאדום
                
                    // עדכון מספר עוקבים בעמוד הפרופיל
                    const followersEl = document.getElementById("NumOfFollowing");
                    if (followersEl) 
                    {
                        followersEl.textContent = parseInt(followersEl.textContent) + 1;
                    }
                } 

                else 
                {
                    followBtn.textContent = 'FOLLOW';
                    followBtn.classList.remove('unfollow');  // הסר קלאס אדום
                
                    const followersEl = document.getElementById("NumOfFollowing");
                    if (followersEl) 
                    {
                        followersEl.textContent = parseInt(followersEl.textContent) - 1;
                    }
                }
            }


        });

        li.appendChild(avatarDiv);
        li.appendChild(descDiv);
        li.appendChild(followBtn);

        li.addEventListener('click', async () => {
            await createOrOpenChat([li.dataset.username]);
            searchModel.classList.add('search-modal-collapsed');
            searchModel.style.zIndex = '0';
            document.getElementById('sidebar').style.zIndex = '1';
            overlay2.classList.add('hidden');
        });

        liElements.push(li); // שמור את ה-LI במערך
    }

    // עכשיו מוסיפים את כולם בבת אחת ל-DOM
    resultsContainer.append(...liElements);

    // Control overflow
    const resultsBox = document.getElementById("results");
    resultsBox.style.overflowY = limitedResults.length < 8 ? "hidden" : "auto";
}



async function uploadSearchResults_searchModal(searchString) {
    const searchResultData = await liveUsersSearch(searchString);
    await renderSearchResults(searchResultData);
}


let currentUsersController = null;
async function liveUsersSearch(searchString, eventTarget) {
    // if a former fetch is still running - shut it off
    if(currentUsersController)
        currentUsersController.abort()


    // signal to shut off fetchs which take too long
    currentUsersController = new AbortController()
    const signal = currentUsersController.signal
    try {
    const response = await fetch('/users/searchByFullnameAndUsername', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            search_string: searchString,
            currentUser: AccountUsername
        }),
        signal: signal
    })
    let searchResultData  = await response.json()

            // סינון המשתמש הנוכחי והגבלת תוצאות ל-20
        return searchResultData
            .filter(res => res.username !== AccountUsername)
            .slice(0, 20)
    }
    catch(err) {
        // if we caught an abort - its ok we sent it
        if(err.name ==="AbortError") return 
        console.error("Live Search Failed:", err)
    }
}



// to ease the search for the server - send the last req 0.4s after the user stop typing
function debounce(fn, delay_MS) {
    let timer;

    // return f with some arguments, every time debounce gets called - clear timer
    // if debounce doesn't get called in delay_MS milisecends fn will be called
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay_MS)
    }
}


















//switch between Posts, Saved and Tagged screens
const logos = document.querySelectorAll('.postsSavedTaggedLogos');
const shareSections = document.querySelectorAll('.SharePhotos');

document.querySelector('#postsLogo').classList.add('active');
document.querySelector('#share').classList.add('active');

logos.forEach((logo, index) => {
    logo.addEventListener('click', () => {
    logos.forEach(l => l.classList.remove('active'));
    shareSections.forEach(s => s.classList.remove('active'));

    logo.classList.add('active');
    shareSections[index].classList.add('active');
  });
});







// Open/Close profile settings div
function OpenSettings()
{
    const modal = document.querySelector('.settings-modal');
    if (modal)
    {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function CloseSettings()
{
    const modal = document.querySelector('.settings-modal');
    if (modal)
    {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}



// Open/Close delete account confirmation div
function OpenDelete()
{
    const modal = document.querySelector('.delete-modal');
    if (modal)
    {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function CloseDelete()
{
    const modal = document.querySelector('.delete-modal');
    if (modal)
    {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}



// Open/Close Log out div
function OpenLogout()
{
    const modal = document.querySelector('.logout-modal');
    if (modal)
    {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function CloseLogout()
{
    const modal = document.querySelector('.logout-modal');
    if (modal)
    {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}



// Open/Close weather div
async function OpenWeather() {
    const modal = document.querySelector('.weather-modal');
    const cityEl = document.getElementById("UsersCity");
    const weatherEl = document.getElementById("UsersWeather");

    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const response = await fetch("/weather", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ lat, lon })
            });

            const data = await response.json();

            cityEl.textContent = `City: ${data.city}`;
            weatherEl.textContent = `Weather: ${data.temp}°C, ${data.description}`;
        } catch (err) {
            cityEl.textContent = "שגיאה בקבלת המידע";
            weatherEl.textContent = "";
            console.error(err);
        }
    }, (error) => {
        cityEl.textContent = "לא ניתן לקבל את המיקום שלך.";
        weatherEl.textContent = "";
        console.error(error);
    });
}

function CloseWeather()
{
    const modal = document.querySelector('.weather-modal');
    if (modal)
    {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}




//Load profile data to screen
async function loadProfile() 
{
    const username = localStorage.getItem('currentUser');
    if (!username) 
        {
        window.location.href = "/login.html"; 
        return;
    }

    try {
        const res = await fetch(`/users/getByUsername/${encodeURIComponent(username)}`);        
        console.log(res);
        if (!res.ok) throw new Error("User not found");
        const user = await res.json();  

        //Getting the data from Mongo
        document.getElementById("ProfileUsername").innerText = user.username;
        document.getElementById("fullName").innerText = user.fullName;
        document.getElementById("profileBio").innerText = user.bio;
        document.getElementById('threadsPart').innerHTML = `<img id="threadsLogo" src="https://cdn4.iconfinder.com/data/icons/threads-by-instagram/128/threads-logo-brand-sign-rounded-1024.png">${user.username}`;
        document.querySelector('.profile-pic-placeholder').src = user.profilePic;
        document.getElementById("pfp-l").src = user.profilePic;


        //Update followers and following stats
        numOfFollowers = user.followers.length;
        numOfFollowing = user.following.length;
        document.getElementById("NumOfFollowers").innerText = numOfFollowers;
        document.getElementById("NumOfFollowing").innerText = numOfFollowing;




        //Show/Hide threads icon
        const threadsPart = document.getElementById("threadsPart");
        if (user.hasThreads === true) 
        {
            threadsPart.style.display = 'flex';
        } 
        else 
            {
            threadsPart.style.display = 'none';
        }



    } 
    catch (err) {
        console.error(err);
        alert("Failed to load profile");
    }
}
document.addEventListener("DOMContentLoaded", loadProfile);






// Delete Account
async function DeleteAccount() 
{

    try {
        //save the username to delete
        const username = localStorage.getItem("currentUser");

        const res = await fetch(`/users/delete/${username}`, {method: 'DELETE'});

        if (res.ok) {
            alert("Account deleted successfully");
            localStorage.clear(); // Delete current username
            window.location.href = "/login/login.html"; // return to login
        } else {
            const data = await res.json();
            alert("Failed to delete account: " + data.error);
        }
    } catch (err) {
        console.error("Error deleting account:", err);
        alert("Something went wrong.");
    }
}

/* Log Out */
async function LogOut() 
{
    localStorage.removeItem("currentUser");
    window.location.href = "/login/login.html"
}