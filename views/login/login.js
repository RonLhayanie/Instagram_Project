


/* "show" button in password */ 
function show()
{
    var passInput = document.getElementById("pass");
    var status = event.target;

    if(passInput.type == "password")
    {
        passInput.type = "text";
        status.innerText = "Hide";
    }
    else
    {
        passInput.type = "password";
        status.innerText = "Show";
    }


}

function showError(spanId, message) 
{
    const span = document.getElementById(spanId);

    span.textContent = message;
    span.style.display = "block";   //Show Error message
    span.classList.add("show");
}


async function login(event) 
{
    event.preventDefault()
    try
    {
        console.log("4567")
        const username = document.getElementById("user").value.trim();
        const password = document.getElementById("pass").value.trim();

        
        if (!username || !password) 
        {
            showError("usererror", "Please enter username and password");
            return;
        }
            
        const res = await fetch("/users/login", {
            method: "POST" , 
            headers: { "Content-Type": "application/json" } , 
            body: JSON.stringify({username, password})})
            
        if(res.ok)
        {
            localStorage.setItem('currentUser',username);   
            window.location.href = "../feed/feed.html"
        }
        else 
        {
            showError("usererror","Username or password is incorrect");
        }
    }
    catch(err)  
    {
        console.error(err);
        showError("usererror", "username or password is incorrect");
    }
}

/* Shop logos */
function openGoogleShop()
{
    window.open("https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D95D527BA-C6DA-4AD6-A9CF-BC47EB923C12%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps://www.google.com/&pli=1", "_blank");
}

function openMicrosoftShop()
{
    window.open("https://apps.microsoft.com/detail/9nblggh5l9xt?hl=he-IL&gl=IL", "_blank");
}

function clearError(spanId) {
    const span = document.getElementById(spanId);
    span.textContent = "";
    span.style.display = "none";    //Remove Error message
    span.classList.remove("show");
}

document.getElementById("user").addEventListener("keydown", async function () {clearError("usererror");});   
document.getElementById("pass").addEventListener("keydown", async function () {clearError("usererror");});   

