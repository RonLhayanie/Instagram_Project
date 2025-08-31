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


const logos = document.querySelectorAll('.postsSavedTaggedLogos');
const shareSections = document.querySelectorAll('.SharePhotos');

// אפשר להגדיר שמראש ה-Posts פעיל
document.querySelector('#postsLogo').classList.add('active');
document.querySelector('#share').classList.add('active');

logos.forEach((logo, index) => {
  logo.addEventListener('click', () => {
    // מסיר active מכולם
    logos.forEach(l => l.classList.remove('active'));
    shareSections.forEach(s => s.classList.remove('active'));

    // מוסיף active לאייקון שנלחץ ולמסך המתאים
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






async function loadProfile() 
{
    const username = localStorage.getItem('currentUser');
    if (!username) 
        {
        window.location.href = "/login.html"; 
        return;
    }

    try {
        const res = await fetch(`/users/getByUsername/${username}`);

        console.log(localStorage.getItem('currentUser'));

        if (!res.ok) throw new Error("User not found");
        const user = await res.json();

        // כאן מציגים בדף את המידע מהשרת
        document.getElementById("ProfileUsername").innerText = user.username;
        document.getElementById("fullName").innerText = user.fullName;
        document.getElementById("profileBio").innerText = user.bio;
        document.getElementById('threadsPart').innerHTML = `<img id="threadsLogo" src="https://cdn4.iconfinder.com/data/icons/threads-by-instagram/128/threads-logo-brand-sign-rounded-1024.png">${user.username}`;
        document.querySelector('.profile-pic-placeholder').src = user.profilePic;
        document.getElementById("pfp-l").src = user.profilePic;

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






/* Delete Account */
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