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





async function loadProfile() 
{
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = "/login.html"; // אם אין משתמש מחובר
        return;
    }

    try {
        const res = await fetch(`/users/getByUsername/${username}`);
        if (!res.ok) throw new Error("User not found");

        const user = await res.json();

        // כאן מציגים בדף את המידע מהשרת
        document.getElementById("ProfileUsername").innerText = user.username;
        document.getElementById("fullName").innerText = user.fullName;
        document.getElementById("profileBio").innerText = user.bio;
        document.getElementById('threadsPart').innerHTML = `<img id="threadsLogo" src="https://cdn4.iconfinder.com/data/icons/threads-by-instagram/128/threads-logo-brand-sign-rounded-1024.png">${user.username}`;

    } catch (err) {
        console.error(err);
        alert("Failed to load profile");
    }
}
document.addEventListener("DOMContentLoaded", loadProfile);
