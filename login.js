/* Username and Password verification */

function UsernameVerification()     /* check if the username is valid */
{

    var usernameInput = document.getElementById("user").value;
    
    var PatternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     
    var PatternPhone = /^05\d{8}$/;
    var PatternUsername = /^[^ %&$@()!?]{1,30}$/;

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
    else
    {
        return false;
    }

}

function PasswordVerification()     /* check if the password is valid */
{
    var passwordInput = document.getElementById("pass").value;

    PatterPassword = /^[^ %&$@]{6,30}$/

    if(PatterPassword.test(passwordInput) == true)
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

    var isUsernameValid = UsernameVerification();
    var isPasswordValid = PasswordVerification();

    if(isUsernameValid == true && isPasswordValid == true)
    {
        window.location.href = "feed.html";
    }
    else if(isUsernameValid == false && isPasswordValid == false)
    {
        errorMsg.style.display = "block";
        errorMsg.innerHTML = "Username must be a real Email, Phone, or not to contain spaces/any spacial characters. <br> Password must contain at least 6 characters, and without spaces.";
    }
    else if(isUsernameValid == true && isPasswordValid == false)
    {
        errorMsg.style.display = "block";
        errorMsg.innerHTML = "Password must contain at least 6 characters, and without spaces.";
    }
    else if(isUsernameValid == false && isPasswordValid == true)
    {
        errorMsg.style.display = "block";
        errorMsg.innerHTML = "Username must be a real Email, Phone, or not to contain spaces/any spacial characters";
    }

}




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