/* Username and Password verification */

function UsernameVerification()     /* check if the username is valid */
{

    var usernameInput = document.getElementById("user").value;
    
    var PatternEmail = /^[^\s@]+@[^\s@.]+.[^\s@.]+$/;     /* containing one "@" and at least one "." after it */
    var PatternPhone = /^05\d{8}$/;                      /* starting with "05" and exactly 8 digits */
    var PatternUsername = /^(?=\S{6,}$)(?=.*[A-Za-z])(?=.*[._]).+$/;   /*at least 6 characters, no spaces, includes at least one letter and "." or "_" */

    if(PatternEmail.test(usernameInput) == true)
    {
        return true;
    }
    else if(PatternPhone.test(usernameInput) == true)
    {
        return true;
    }
    else if(PatternUsername.test(usernameInput) == true)
    {
        return true;
    }
    else if (/^[0-9]+$/.test(usernameInput)) 
    {
        return "invalidPhone";
    } 
    else if (usernameInput.includes("@")) 
    {
    return "invalidEmail";
    }
    else
    {
        return "invalidUsername"
    }

}

function PasswordVerification()     /* check if the password is valid */
{
    var passwordInput = document.getElementById("pass").value;

    var PatternPassword = /^[^\s]{6,}$/;  /* at least 6 characters without spaces */

    if(PatternPassword.test(passwordInput) == true)
    {
        return true;
    }
    else
    {
        return false;
    }

}
 
function verification()
{
    var errorMsg = document.getElementById("verificationAlert");

    var usernameStatus = UsernameVerification(); 
    var passwordStatus = PasswordVerification(); 

    errorMsg.style.display = "none";
    errorMsg.innerHTML = "";

    if (usernameStatus === true && passwordStatus === true) 
    {
        window.location.href = "../feed/feed.html";
    } 
    else 
    {
        errorMsg.style.display = "block";

        // Check Username 
        if (usernameStatus !== true) 
        {
            if (usernameStatus === "invalidPhone") 
            {
                errorMsg.innerHTML = "Phone number is invalid.";
            }

            else if (usernameStatus === "invalidEmail") 
            {
                errorMsg.innerHTML = "Email is invalid.";
            }

            else if (usernameStatus === "invalidUsername") 
            {
                errorMsg.innerHTML = "Username is invalid.";
            }
        }

        // Check Password
        if (passwordStatus === false) 
        {
            errorMsg.innerHTML += (errorMsg.innerHTML ? "<br>" : "") + "Password is invalid.";
        }
    }
}

addEventListener('submit', (event) => {
    event.preventDefault()
    verification()
})


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


/* Shop logos */
function openGoogleShop()
{
    window.open("https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D95D527BA-C6DA-4AD6-A9CF-BC47EB923C12%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps://www.google.com/&pli=1", "_blank");
}

function openMicrosoftShop()
{
    window.open("https://apps.microsoft.com/detail/9nblggh5l9xt?hl=he-IL&gl=IL", "_blank");
}
