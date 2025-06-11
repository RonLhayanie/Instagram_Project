///like pop and update likes

const likeButtons = document.querySelectorAll(".like");

likeButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {

    const post = btn.closest(".post-actions").nextElementSibling; 
    const likesCountSpan = post.querySelector(".likes-count");

    let currentLikes = parseInt(likesCountSpan.textContent.replace(/,/g, ''));

    if (btn.src.includes("https://cdn-icons-png.flaticon.com/256/130/130195.png")) { // empty heart
      btn.src = "https://cdn-icons-png.flaticon.com/256/2107/2107845.png"; // full heart
      likesCountSpan.textContent = (currentLikes + 1).toLocaleString() + " likes";

              btn.classList.add("pop");
  setTimeout(() => {
    btn.classList.remove("pop");
  }, 400);
  
    } else {
      btn.src = "https://cdn-icons-png.flaticon.com/256/130/130195.png"; // empty heart
      likesCountSpan.textContent = Math.max(0, currentLikes - 1).toLocaleString() + " likes";

        btn.classList.add("pop");
  setTimeout(() => {
    btn.classList.remove("pop");
  }, 400);

    }
  });
});
 
///btn more shows all text

const moreButtons = document.querySelectorAll(".more");

moreButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const postText = btn.closest(".post-text");
    const shortText = postText.querySelector(".short-text");
    const fullText = postText.querySelector(".full-text");

    if (fullText.style.display === "none") {
      shortText.style.display = "none";
      fullText.style.display = "inline";
      btn.textContent = "less";
    } else {
      shortText.style.display = "inline";
      fullText.style.display = "none";
      btn.textContent = "more";
    }
  });
});


///save btn

const saveButtons = document.querySelectorAll(".save");

saveButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {

    const post = btn.closest(".post-actions").nextElementSibling; 

    if (btn.src.includes("https://cdn-icons-png.flaticon.com/256/3082/3082331.png")) { // empty save
      btn.src = "https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvMTUzMjgvMTUzMjgzMzkucG5n&ts=1749665856&sig=a92e6f131b52b5e32899457722f0a9c896eff32037ee4f131e41bdd32ac6e65f"; // full save

    } else {
      btn.src = "https://cdn-icons-png.flaticon.com/256/3082/3082331.png"; // empty save
    }
  });
});
 

/// search function
const toggleBtn = document.getElementById("search-toggle");
const modal = document.getElementById("search-modal");
const closeBtn = document.getElementById("close-search");
const sidebarLeft = document.querySelector(".sidebar-left");

toggleBtn.addEventListener("click", () => {
  sidebarLeft.classList.add("sidebar--collapsed");
  modal.classList.add("active");
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  sidebarLeft.classList.remove("sidebar--collapsed");
  modal.classList.remove("active");

  // מחכה שהאנימציה תסתיים לפני הסתרה מוחלטת
  setTimeout(() => {
    if (!modal.classList.contains("active")) {
      modal.style.display = "none";
    }
  }, 300); // חייב להתאים ל-transition ב-CSS
});

///hide sidebar-left spans

  const searchToggle = document.getElementById("search-toggle");
  const searchModal = document.getElementById("search-modal");
  const closeSearch = document.getElementById("close-search");
  const sidebar = document.querySelector(".sidebar-left");
  const logoImg = document.getElementById("lftlogo");

  searchToggle.addEventListener("click", () => {
    searchModal.style.display = "flex";
    sidebar.classList.add("sidebar--collapsed");
    logoImg.classList.add("searchMode");
    logoImg.src="https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvMTM4NC8xMzg0MDMxLnBuZw==&ts=1749666069&sig=150c3c7fcf870f9fd23836d52ce204889d1632b16d097eb384acae74dab3f1b6"
  });

  closeSearch.addEventListener("click", () => {
    searchModal.style.display = "none";
    sidebar.classList.remove("sidebar--collapsed");
    logoImg.src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
  });

  