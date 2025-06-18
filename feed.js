// toggle dark mode
  const toggle = document.getElementById('darkModeToggle');
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggle.checked);
    });

    /// scroll to top button
  const feed = document.querySelector("main.feed");
  const scrollBtn = document.getElementById("scrollToTopBtn");

  feed.addEventListener("scroll", () => {
    if (feed.scrollTop > 100) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    feed.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

// like pop

const likeButtons = document.querySelectorAll(".like");

likeButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    const post = btn.closest(".post-actions").nextElementSibling; 
    const likesCountSpan = post.querySelector(".likes-count");
    let currentLikes = parseInt(likesCountSpan.textContent.replace(/,/g, ''));

    const isLiked = btn.src.includes("2107845.png"); // full heart

    if (!isLiked) {
      btn.src = "https://cdn-icons-png.flaticon.com/256/2107/2107845.png"; // full heart
      btn.classList.add("liked");
      likesCountSpan.textContent = (currentLikes + 1).toLocaleString() + " likes";
    } else {
      btn.src = "https://cdn-icons-png.flaticon.com/256/130/130195.png"; // empty heart
      btn.classList.remove("liked");
      likesCountSpan.textContent = Math.max(0, currentLikes - 1).toLocaleString() + " likes";
    }

    // POP animation
    btn.classList.add("pop");
    setTimeout(() => {
      btn.classList.remove("pop");
    }, 400);
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

    if (btn.src.includes("https://static.thenounproject.com/png/bookmark-icon-809338-512.png")) { // empty save
      btn.src="https://static.thenounproject.com/png/bookmark-icon-809340-512.png"; // full save

    } else {
      btn.src = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png"; // empty save
    }
  });
});
 

/// search function

const toggleBtn = document.getElementById("search-toggle");
const modal = document.getElementById("search-modal");
const closeBtn = document.getElementById("close-search");
const sidebarLeft = document.querySelector(".sidebar-left");

const animationDuration = 500; // זמן האנימציה במילישניות (0.5 שניות)

toggleBtn.addEventListener("click", () => {
  sidebarLeft.classList.add("sidebar--collapsed");

  modal.classList.remove("closing");
  modal.style.display = "flex";  // חשוב להציג קודם
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
});

closeBtn.addEventListener("click", () => {
  sidebarLeft.classList.remove("sidebar--collapsed");

  modal.classList.remove("active");
  modal.classList.add("closing");

  setTimeout(() => {
    modal.classList.remove("closing");
    modal.style.display = "none";  // להסתיר רק אחרי האנימציה
  }, animationDuration);
});

document.addEventListener('DOMContentLoaded', () => {
  const clearAllBtn = document.getElementById('clearAll');
  const recentSection = modal.querySelector('.recent-section');
  const searchInput = modal.querySelector('.search-input');
  const filterRadios = modal.querySelectorAll('input[name="filter"]');

  // מחיקת פריט ספציפי - עם עצירת התפשטות האירוע
  recentSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
      e.stopPropagation();
      const item = e.target.closest('.recent-item');
      if (item) item.remove();
    }
  });

  clearAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const items = recentSection.querySelectorAll('.recent-item');
    items.forEach(item => item.remove());
  });

  //// חיפוש לפי פילטר

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const selectedFilter = Array.from(filterRadios).find(r => r.checked)?.value || 'username';

  // --- חיפוש במשתמשים (recent-item)
  const items = recentSection.querySelectorAll('.recent-item');
  items.forEach(item => {
    if (selectedFilter === 'username') {
      const username = item.querySelector('.m_username')?.textContent.toLowerCase() || "";
      const name = item.querySelector('.m_name')?.textContent.toLowerCase() || "";
      const textToSearch = username + ' ' + name;

      item.style.display = textToSearch.includes(query) ? "" : "none";
    } else {
      item.style.display = "";
    }
  });

const posts = document.querySelectorAll('.posts-wrapper .post');
const sidebar = document.querySelector('.sidebar-right');
let anyVisible = false;
let hiddenCount = 0;

posts.forEach((post) => {
  const shortText = post.querySelector('.short-text')?.textContent.toLowerCase() || "";
  const fullText = post.querySelector('.full-text')?.textContent.toLowerCase() || "";
  const description = shortText + " " + fullText;

  if (selectedFilter === 'description') {
    const isMatch = description.includes(query);
    post.style.display = isMatch ? "block" : "none";
    if (isMatch) anyVisible = true;
    else hiddenCount++;
  } else {
    post.style.display = "";
    anyVisible = true;
  }
});

// עדכון קלאסים לפי מספר ההסתרות
sidebar.classList.remove('hide-1', 'hide-2', 'hide-3plus');

if (hiddenCount === 1) {
  sidebar.classList.add('hide-1');
} else if (hiddenCount === 2) {
  sidebar.classList.add('hide-2');
} else if (hiddenCount >= 3) {
  sidebar.classList.add('hide-3plus');
}else if (hiddenCount === 0) {
  sidebar.classList.add('hide-0');
}

// הודעה אם אין בכלל פוסטים
const noPostsMessage = document.getElementById('no-posts-message');
noPostsMessage.style.display = anyVisible ? 'none' : 'block';
});
});



///hide sidebar-left spans

  const searchToggle = document.getElementById("search-toggle");
  const searchModal = document.getElementById("search-modal");
  const closeSearch = document.getElementById("close-search");
  const sidebar = document.querySelector(".sidebar-left");
  const logoImg = document.getElementById("logo-img-full");



  searchToggle.addEventListener("click", () => {
    searchModal.style.display = "flex";
    sidebar.classList.add("sidebar--collapsed");
    logoImg.classList.add("searchMode");
  });

  closeSearch.addEventListener("click", () => {
    searchModal.style.display = "none";
    sidebar.classList.remove("sidebar--collapsed");
    logoImg.src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
  });

  document.addEventListener("click", (event) => {
    const isClickInside =
      searchModal.contains(event.target) ||
      searchToggle.contains(event.target) ||
      sidebar.contains(event.target);

    if (!isClickInside && searchModal.style.display === "flex") {
      searchModal.style.display = "none";
      sidebar.classList.remove("sidebar--collapsed");
      logoImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png";
    }
  });
  



