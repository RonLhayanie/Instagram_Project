// ===========================
// CHAR COUNTER FOR TEXTAREAS
// ===========================
const textareas = document.querySelectorAll(".changeInputs");

textareas.forEach(textarea => {
    const counter = textarea.parentElement.querySelector(".charCounter");
    const maxLength = textarea.getAttribute("maxlength");

    textarea.addEventListener("input", () => {
        let length = textarea.value.length;
        if (counter) counter.textContent = `${length} / ${maxLength}`;

        if (length >= maxLength) {
            textarea.style.border = "1px solid red";
            if (counter) counter.style.color = "red";
        } else if (length === 0) {
            textarea.style.border = "1px solid #dde1e5";
            if (counter) counter.style.color = "#888";
        } else {
            textarea.style.border = "1px solid black";
            if (counter) counter.style.color = "#888";
        }
    });
});

// ===========================
// PROFILE PICTURE UPLOAD
// ===========================
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

// ===========================
// VALIDATION FUNCTIONS
// ===========================
function PhoneVerification() {
    const phone = document.getElementById("phoneText").value.trim();
    const PatternPhone = /^05\d{8}$/;
    return PatternPhone.test(phone) ? true : "Enter a valid phone number";
}

function EmailVerification() {
    const email = document.getElementById("emailText").value.trim();
    const PatternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return PatternEmail.test(email) ? true : "Enter a valid email address";
}

function PasswordVerification() {
    const pass = document.getElementById("passwordText").value.trim();
    const username = document.getElementById("usernameText").value.trim();
    const fullname = document.getElementById("fullnameText").value.trim();
    const PatternPassword = /^[^\s]{6,}$/;

    if (!PatternPassword.test(pass)) return "Password must be at least 6 characters long and contain no spaces";
    if (username && pass.toLowerCase() === username.toLowerCase()) return "Password cannot match username";
    if (fullname && pass.toLowerCase() === fullname.toLowerCase()) return "Password cannot match full name";

    return true;
}

function FullNameVerification() {
    const fullname = document.getElementById("fullnameText").value.trim();
    return fullname.length > 1 ? true : "Please fill out this field";
}

function UsernameVerification() {
    const username = document.getElementById("usernameText").value.trim();
    const PatternUsername = /^[A-Za-z0-9_]+$/;
    return PatternUsername.test(username) ? true : "Invalid username";
}

// ===========================
// HELPER FUNCTIONS
// ===========================
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

// ===========================
// USERNAME SERVER CHECK
// ===========================
let usernameAvailable = false;

document.getElementById("usernameText").addEventListener("blur", async function () {
    const username = this.value.trim();
    if (!username) {
        clearError("UsernameVer");
        usernameAvailable = false;
        return;
    }

    const clientValidation = UsernameVerification();
    if (clientValidation !== true) {
        showError("UsernameVer", clientValidation);
        usernameAvailable = false;
        return;
    }

    try {
        const res = await fetch("/users/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        const data = await res.json();
        if (data.available) {
            clearError("UsernameVer");
            this.style.borderColor = "lightgreen";
            this.style.borderWidth = "1.5px";
            usernameAvailable = true;
        } else {
            showError("UsernameVer", "Username already exists");
            this.style.borderColor = "red";
            this.style.borderWidth = "1.5px";
            usernameAvailable = false;
        }
    } catch (err) {
        console.error(err);
        showError("UsernameVer", "Server error");
        usernameAvailable = false;
    }
});

// ===========================
// BLUR EVENTS FOR FIELDS
// ===========================
const fields = [
    { inputId: "phoneText", verifyFn: PhoneVerification, spanId: "PhoneVer" },
    { inputId: "emailText", verifyFn: EmailVerification, spanId: "EmailVer" },
    { inputId: "passwordText", verifyFn: PasswordVerification, spanId: "PasswordVer" },
    { inputId: "fullnameText", verifyFn: FullNameVerification, spanId: "FullNameVer" }
];

fields.forEach(field => {
    const inputEl = document.getElementById(field.inputId);
    inputEl.addEventListener("blur", () => {
        const value = inputEl.value.trim();
        if (value !== "") {
            const result = field.verifyFn();
            if (result === true) {
                clearError(field.spanId);
                inputEl.classList.add("validd");
                inputEl.classList.remove("invalid");
            } else {
                showError(field.spanId, result);
                inputEl.classList.add("invalid");
                inputEl.classList.remove("validd");
            }
        } else {
            clearError(field.spanId);
            inputEl.classList.remove("invalid", "validd");
        }
    });
});

// ===========================
// SUBMIT BUTTON
// ===========================
const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Validate fields
    let allValid = true;
    fields.forEach(field => {
        const inputEl = document.getElementById(field.inputId);
        const value = inputEl.value.trim();
        if (value !== "") {
            const result = field.verifyFn();
            if (result !== true) {
                allValid = false;
                showError(field.spanId, result);
                inputEl.classList.add("invalid");
            }
        } else {
            allValid = false;
            showError(field.spanId, "This field is required");
            inputEl.classList.add("invalid");
        }
    });

    const fullNameResult = FullNameVerification();
    if (fullNameResult !== true) allValid = false;

    if (!usernameAvailable) {
        allValid = false;
        showError("UsernameVer", "Username already exists");
        document.getElementById("usernameText").classList.add("invalid");
    }

    if (!allValid) return;

    // Get current logged-in user from localStorage
    const currentUsername = localStorage.getItem('username');

    // Prepare updated user object
    const updatedUser = {
        currentUsername: currentUsername,
        username: document.getElementById("usernameText").value.trim(),
        fullName: document.getElementById("fullnameText").value.trim(),
        bio: document.getElementById("bioText").value.trim(),
        email: document.getElementById("emailText").value.trim(),
        phone: document.getElementById("phoneText").value.trim(),
        profilePic: profilePicImg.src
    };

    // Send to server
    try {
        const res = await fetch('/users/updateProfile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });

        const data = await res.json();
        if (data.success) {
            // update localStorage username if it changed
            localStorage.setItem('username', updatedUser.username);
            localStorage.setItem('profileData', JSON.stringify(updatedUser));

            window.location.href = '/profile/profile.html';
        } else {
            alert('Error updating profile: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
});
