//Navigation left sidebar
function goToFeed()
{
    window.location.href = "/feed/feed.html";
}

function goToMessages()
{
    window.location.href = "/chats/chats.html";
}

function goToProfile()
{
    window.location.href = "profile.html";
}






// CHAR COUNTER FOR TEXTAREAS
const textareas = document.querySelectorAll(".changeInputs");

textareas.forEach(textarea => {
    const counter = textarea.parentElement.querySelector(".charCounter");
    const maxLength = textarea.getAttribute("maxlength");

    textarea.addEventListener("input", () => {
        let length = textarea.value.length;
        if (counter) counter.textContent = `${length} / ${maxLength}`;
    });
});





// Profule picture upload (to change profile pic)
const profilePicBtn = document.getElementById("profilePicChangePhoto");
const profilePicImg = document.querySelector("#changePhoto .profile-pic-placeholder");

profilePicBtn.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    fileInput.click();
});









// VALIDATION FUNCTIONS
function PhoneVerification()    // Phone number
{
    const phone = document.getElementById("phoneText").value.trim();
    const PatternPhone = /^05\d{8}$/;
    return PatternPhone.test(phone) ? true : "Enter a valid phone number";
}

function EmailVerification()    // Email
{
    const email = document.getElementById("emailText").value.trim();
    const PatternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return PatternEmail.test(email) ? true : "Enter a valid email address";
}

function PasswordVerification()     // Password
{
    const pass = document.getElementById("passwordText").value.trim();
    const username = document.getElementById("usernameText").value.trim();
    const fullname = document.getElementById("fullnameText").value.trim();
    const PatternPassword = /^[^\s]{6,}$/;

    if (!PatternPassword.test(pass)) return "Password must be at least 6 characters long and contain no spaces";
    if (username && pass.toLowerCase() === username.toLowerCase()) return "Password cannot match username";
    if (fullname && pass.toLowerCase() === fullname.toLowerCase()) return "Password cannot match full name";

    return true;
}

function FullNameVerification()     // Full name
{
    const fullname = document.getElementById("fullnameText").value.trim();
    return fullname.length > 1 ? true : "Please fill out this field";
}

function UsernameVerification()     // Username
{
    const username = document.getElementById("usernameText").value.trim();
    const PatternUsername = /^[A-Za-z0-9_]+$/;
    return PatternUsername.test(username) ? true : "Invalid username";
}





// Show/Close error
function showError(spanId, message) {
    const span = document.getElementById(spanId);
    if (span) {
        span.textContent = message;
        span.style.display = "block";
        span.classList.add("show");
    }
}

function clearError(spanId) {
    const span = document.getElementById(spanId);
    if (span) {
        span.textContent = "";
        span.style.display = "none";
        span.classList.remove("show");
    }
}






// Submit button
const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    let allValid = true;
    const usernameEl = document.getElementById("usernameText");
    const currentUsername = localStorage.getItem('currentUser');
    const newUsername = usernameEl.value.trim();
    let usernameAvailable = false;

    // Validate username locally
    const usernameValidation = UsernameVerification();
    if (usernameValidation !== true) {
        allValid = false;
        showError("UsernameVer", usernameValidation);
        usernameEl.classList.add("invalid");
    } else {
        // Check username availability only if changed
        if (newUsername !== currentUsername) {
            try {
                const res = await fetch("/users/check-username", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: newUsername }),
                });
                const data = await res.json();
                if (data.available) {
                    usernameAvailable = true;
                    clearError("UsernameVer");
                    usernameEl.classList.add("validd");
                    usernameEl.classList.remove("invalid");
                } else {
                    allValid = false;
                    showError("UsernameVer", "Username already exists");
                    usernameEl.classList.add("invalid");
                }
            } catch (err) {
                console.error(err);
                allValid = false;
                showError("UsernameVer", "Server error");
            }
        } else {
            // If username didn't changed
            usernameAvailable = true;
            clearError("UsernameVer");
            usernameEl.classList.add("validd");
            usernameEl.classList.remove("invalid");
        }
    }

    // Validate other fields
    const fields = [
        { inputId: "phoneText", verifyFn: PhoneVerification, spanId: "PhoneVer" },
        { inputId: "emailText", verifyFn: EmailVerification, spanId: "EmailVer" },
        { inputId: "passwordText", verifyFn: PasswordVerification, spanId: "PasswordVer" },
        { inputId: "fullnameText", verifyFn: FullNameVerification, spanId: "FullNameVer" }
    ];

    fields.forEach(field => {
        const inputEl = document.getElementById(field.inputId);
        const result = field.verifyFn();

        if (result === true) {
            clearError(field.spanId);
            inputEl.classList.remove("invalid");
            inputEl.classList.add("validd");
        } else {
            allValid = false;
            showError(field.spanId, result);
            inputEl.classList.remove("validd");
            inputEl.classList.add("invalid");
        }
    });

    if (!allValid) return;

    // updated user data
    const updatedUser = {
        currentUsername: currentUsername,
        username: newUsername,
        fullName: document.getElementById("fullnameText").value.trim(),
        bio: document.getElementById("bioText").value.trim(),
        email: document.getElementById("emailText").value.trim(),
        phone: document.getElementById("phoneText").value.trim(),
        profilePic: document.querySelector("#changePhoto .profile-pic-placeholder").src,
        password: document.getElementById("passwordText").value.trim(),
        hasThreads: document.getElementById('switch').checked
    };

    // Send update data to server
    try {
        const res = await fetch('/users/updateProfile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem('currentUser', updatedUser.username);
            window.location.href = '/profile/profile.html';
        } else {
            alert('Error updating profile: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
});







// Load Existing data to fields
document.addEventListener("DOMContentLoaded", async () => {
    const currentUsername = localStorage.getItem("currentUser");

    if (!currentUsername) {
        alert("No user logged in!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`/users/getByUsername/${encodeURIComponent(currentUsername)}`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to load user data");
        }
        const user = await response.json();

        // Insert data to fields
        document.getElementById("profilePicUsername").innerHTML = user.username;
        document.getElementById("profilePicFullName").innerHTML = user.fullName;

        document.getElementById("usernameText").value = user.username || "";
        document.getElementById("fullnameText").value = user.fullName || "";
        document.getElementById("emailText").value = user.email || "";
        document.getElementById("phoneText").value = user.phone || "";
        document.getElementById("bioText").value = user.bio || "";
        document.getElementById("passwordText").value = user.password || "";
        document.getElementById("profilePicPreview").src = user.profilePic || "https://cdn-icons-png.flaticon.com/512/12225/12225935.png";


        //switch Threads toggle
        const threadsSwitch = document.getElementById("switch");
        threadsSwitch.checked = user.hasThreads;


        //Update char count to Bio, Username and Full name
        const textareas = document.querySelectorAll(".changeInputs");
        textareas.forEach(textarea => {
            const counter = textarea.parentElement.querySelector(".charCounter");
            const maxLength = textarea.getAttribute("maxlength");

            const updateCounter = () => {
                let length = textarea.value.length;
                if (counter) counter.textContent = `${length} / ${maxLength}`;
            };

            textarea.addEventListener("input", updateCounter);

            updateCounter();
        });


    } catch (err) {
        console.error(err);
        alert("Failed to load profile for editing.");
    }
});
