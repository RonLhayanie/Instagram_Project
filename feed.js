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
      btn.src = "https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvMTUzMjgvMTUzMjgzMzkucG5n&ts=1749345561&sig=2686ae3e55d63b9a15327b473f15a62c44ff5a9af80002517c0bf7499d1ce453"; // full save

    } else {
      btn.src = "https://cdn-icons-png.flaticon.com/256/3082/3082331.png"; // empty save
    }
  });
});
 

/// search function

const toggleBtn = document.getElementById("search-toggle");
const modal = document.getElementById("search-modal");
const closeBtn = document.getElementById("close-search");

toggleBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
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
    logoImg.src="https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvNzE3LzcxNzM5Mi5wbmc=&ts=1749347398&sig=4eefc2ee820fc804f911ac1f3910430db5093f80b1a0efdbcb624024b9af3f1d"
  });

  closeSearch.addEventListener("click", () => {
    searchModal.style.display = "none";
    sidebar.classList.remove("sidebar--collapsed");
    logoImg.src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
  });

  