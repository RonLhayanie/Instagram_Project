

// Phone number Validation
function PhoneVerification() 
{
    const phone = document.getElementById("PhoneNumberInput").value.trim();
    const PatternPhone = /^05\d{8}$/;       // Starts with 05 and contains exactly 10 digits.       EXAMPLE: 0511111111
    
    if (PatternPhone.test(phone)) 
    {
        return true;
    } 
    else 
    {
        return "Enter a valid phone number.";
    }
}

// Email Address Validation
function EmailVerification() 
{
    const email = document.getElementById("EmailAddressInput").value.trim();
    const PatternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;      //Contains text --> @ --> text --> . --> text.      EXAMPLE: aaaaa@gmail.com
    
    if (PatternEmail.test(email)) 
    {
        return true;
    } 
    else 
    {
        return "Enter a valid email address.";
    }
}

// Password Validation
function PasswordVerification() 
{
    const pass = document.getElementById("PasswordInput").value;
    const PatternPassword = /^[^\s]{6,}$/;         //contains at least 6 characters.        EXAMPLE: abcdef
    
    if (PatternPassword.test(pass)) 
    {
        return true;
    } 
    else 
    {
        return "Create a password at least 6 characters long.";
    }
}

// Full Name Validation
function FullNameVerification()
{
    const fullname = document.getElementById("FullNameInput").value.trim();

    if (fullname.length > 1)        // Contains at least 2 characters.      EXAMPLE: ab
    {
        return true;
    }
    else
    {
        return "Please fill out this field";
    }
}

// Username Validation
function UsernameVerification() 
{
    const username = document.getElementById("UsernameInput").value.trim();
    const PatternUsername = /[A-Za-z]/;     //Contains at least 1 character.        EXAMPLE: a

    if (PatternUsername.test(username)) 
    {
        return true;
    } 
    else 
    {
        return "Invalid Username";
    }
}


//Create / Remove Error notification Functions:
function showError(spanId, message, iconId) 
{
    const span = document.getElementById(spanId);

    span.textContent = message;
    span.style.display = "block";   //Show Error message
    span.classList.add("show");
}

function clearError(spanId) {
    const span = document.getElementById(spanId);
    span.textContent = "";
    span.style.display = "none";    //Remove Error message
    span.classList.remove("show");
}



// Fields to check
const fields = [
    {inputId: "PhoneNumberInput", verifyFn: PhoneVerification, spanId: "PhoneVer"},
    {inputId: "EmailAddressInput", verifyFn: EmailVerification, spanId: "EmailVer"},
    {inputId: "PasswordInput", verifyFn: PasswordVerification, spanId: "PasswordVer"},
    {inputId: "UsernameInput", verifyFn: UsernameVerification, spanId: "UsernameVer"},
    {inputId: "FullNameInput", verifyFn: FullNameVerification, spanId: "FullNameVer"}
];



//Check Validation for each field
fields.forEach(field => {
    const inputEl = document.getElementById(field.inputId);

    inputEl.addEventListener("blur", () => 
    {
        const value = inputEl.value.trim();

        if (value !== "")   //only if the user typed in something
        { 
            const result = field.verifyFn();
            if (result === true)    //if field is valid 
            {
                clearError(field.spanId);
                inputEl.classList.remove("invalid");
                inputEl.classList.add("validd");
            } 
            else    //if field is invalid
            {
                showError(field.spanId, result);
                inputEl.classList.remove("validd");
                inputEl.classList.add("invalid");
            }
        } 

        else    //if the user didn't typed in something
        {
            clearError(field.spanId);
            inputEl.classList.remove("invalid", "validd");
        }
    });
});



// SIGN UP BUTTON - check if all fields are correct to finalize sign up
const signUpBtn = document.getElementById("SignUp");

signUpBtn.addEventListener("click", (e) => 
{
    e.preventDefault(); //Prevent auto-submit of the fields

    let allValid = true;

    fields.forEach(field => 
    {
        const inputEl = document.getElementById(field.inputId);
        const value = inputEl.value.trim();

        if (value !== "")       //only if the user typed in something
        { 
            const result = field.verifyFn();
            if (result === true)        //if field is valid
            {
                clearError(field.spanId);
                inputEl.classList.remove("invalid");
            } 
            else        //if field is invalid
            {
                allValid = false;
                showError(field.spanId, result);
                inputEl.classList.add("invalid");
            }
        } 

        else       //if the user didn't typed in something        
        {
            allValid = false;
            showError(field.spanId, "This field is required");
            inputEl.classList.add("invalid");
        }
    });

    //If everything is valid - connect to feed
    if (allValid) 
    {
        window.location.href = "/feed.html";
    }
});



/* "show" button in password */ 
function Show()
{
    var passInput = document.getElementById("PasswordInput");
    var status = event.target;

    if(passInput.type == "password")    //if current status is password - switch to regular text
    {
        passInput.type = "text";
        status.innerText = "Hide";
    }
    else         //if current status is regular text - switch to password
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


//Log in button
function LogInButton()
{
    window.location.href = "/login.html";
}