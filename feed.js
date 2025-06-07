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

