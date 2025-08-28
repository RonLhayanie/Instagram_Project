
//insert dates to select from
function populateDateOptions() 
{
    const daySelect = document.getElementById("DayInput");
    const monthSelect = document.getElementById("MonthInput");
    const yearSelect = document.getElementById("YearInput");
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    //getting the current day to default
    daySelect.innerHTML = "";
    const defaultDayOption = document.createElement("option");
    defaultDayOption.value = currentDay;
    defaultDayOption.text = currentDay;
    defaultDayOption.selected = true; //
    daySelect.appendChild(defaultDayOption);


    // inserting days
    for (let i = 1; i <= 31; i++) 
    {
        if (i !== currentDay) 
        { 
            const option = document.createElement("option");
            option.value = i;
            option.text = i;
            daySelect.appendChild(option);
        }
    }

    
    //getting the current month to default
    monthSelect.innerHTML = "";
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const defaultMonthOption = document.createElement("option");
    defaultMonthOption.value = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    defaultMonthOption.text = monthNames[currentMonth - 1];
    defaultMonthOption.selected = true; 
    monthSelect.appendChild(defaultMonthOption);

    //inserting months
    for (let i = 1; i <= 12; i++) 
    {
        if (i !== currentMonth) 
        {
            const option = document.createElement("option");
            option.value = i < 10 ? `0${i}` : i;
            option.text = monthNames[i - 1];
            monthSelect.appendChild(option);
        }
    }

    //getting the current month to default
    yearSelect.innerHTML = "";
    const defaultYearOption = document.createElement("option");
    defaultYearOption.value = currentYear;
    defaultYearOption.text = currentYear;
    defaultYearOption.selected = true;
    yearSelect.appendChild(defaultYearOption);

    //inserting years (100 years past)
    for (let i = currentYear - 1; i >= currentYear - 100; i--) 
    {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;
        yearSelect.appendChild(option);
    }
}

//activate the function once the page loaded
window.onload = populateDateOptions;







//Check if the age is above 13(Instagram's limitation)
async function isAgeAbove13() {
    const day = parseInt(document.getElementById("DayInput").value);
    const month = parseInt(document.getElementById("MonthInput").value);
    const year = parseInt(document.getElementById("YearInput").value);

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

    if (isNaN(birthDate.getTime()) || birthDate > minAgeDate) {
        OpenVerification();
        return;
    }

    const data = JSON.parse(localStorage.getItem('signupData'));
    data.birthDate = birthDate.toISOString();
    localStorage.setItem('signupData', JSON.stringify(data));

    try {
        const res = await fetch('/users/createAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const createdUser = await res.json();
            localStorage.setItem('currentUser', createdUser.username);
            localStorage.removeItem('signupData');
            window.location.href = "/profile/profile.html";
        } else {
            alert("Error creating account");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}





// Open/Close explanation div
function OpenWhyBirthday() 
{
    const modal = document.querySelector('.birthdays-modal');
    if (modal) 
    {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}
function CloseWhyBirthday()
{
    const modal = document.querySelector('.birthdays-modal');
    if (modal)
    {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}


// Open/Close verification div
function OpenVerification()
{
    const modal = document.querySelector('.verification-modal');
    if (modal)
    {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}
function CloseVerification()
{
    const modal = document.querySelector('.verification-modal');
    if (modal)
    {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}


//Navigate functions
function GoBack()
{
    window.location.href = "signup.html";
}
function LogInButton()
{
    window.location.href = "/login/login.html";
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