function goToFeed()
{
    window.location.href = "../feed/feed.html";
}

function goToMessages()
{
    window.location.href = "../chats/chats.html";
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









window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // אם אין משתמש מחובר, תוכל להפנות ל-login או feed
        window.location.href = "/feed/feed.html";
        return;
    }

    // עדכון תמונת פרופיל
    const profilePicEl = document.querySelector('.profile-pic img');
    if (profilePicEl) profilePicEl.src = currentUser.profilePic;

    // עדכון שם משתמש
    const usernameEl = document.querySelector('.username-section span');
    if (usernameEl) usernameEl.textContent = currentUser.username;

    // עדכון full name
    const fullNameEl = document.getElementById('fullName');
    if (fullNameEl) fullNameEl.textContent = currentUser.fullName;

    // עדכון bio
    const bioEl = document.getElementById('profileBio');
    if (bioEl) bioEl.textContent = currentUser.bio;

    // עדכון Threads username
    const threadsPartEl = document.getElementById('threadsPart');
    if (threadsPartEl) {
        threadsPartEl.innerHTML = `<img id="threadsLogo" src="https://cdn4.iconfinder.com/data/icons/threads-by-instagram/128/threads-logo-brand-sign-rounded-1024.png">${currentUser.username}`;
    }

    // עדכון סטטיסטיקות בסיסיות (אם שמרת אותם)
    const numOfPostsEl = document.getElementById('NumOfPosts');
    const numOfFollowersEl = document.getElementById('NumOfFollowers');
    const numOfFollowingEl = document.getElementById('NumOfFollowing');

    if (numOfPostsEl) numOfPostsEl.textContent = currentUser.posts.length;
    if (numOfFollowersEl) numOfFollowersEl.textContent = currentUser.followers ? currentUser.followers.length : 0;
    if (numOfFollowingEl) numOfFollowingEl.textContent = currentUser.following ? currentUser.following.length : 0;
});