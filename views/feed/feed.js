window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  setTimeout(() => {
    loader.style.display = 'none';
  }, 2000); 
});

document.getElementById('messages-icon').addEventListener('click', () => {
  window.location.href = '../chats/chats.html'
})

// toggle dark mode
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggle.checked);
});

// scroll to top button
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

/// stories scroll
const storiesContainer = document.querySelector('.stories-container');
const scrollLeftBtn = document.querySelector('.scroll-button.left');
const scrollRightBtn = document.querySelector('.scroll-button.right');
const stories = Array.from(document.querySelectorAll('.story'));

scrollLeftBtn.style.display = 'none';  // להתחלה - הכפתור השמאלי מוסתר

// רוחב של סטורי אחד כולל רווח (בפיקסלים) - שנה לפי ה-CSS שלך
const storyWidth = stories[0].offsetWidth + 10; // 10 זה ה-gap בין סטוריז ב-CSS
let cnt = 0;
// גלילה ימינה - גלילה של 3 סטוריז בכל לחיצה
scrollRightBtn.addEventListener('click', () => {


  storiesContainer.scrollBy({ left: storyWidth * 3, behavior: 'smooth' });
});

let cnt1 = 0;

// גלילה שמאלה - גלילה של 3 סטוריז בכל לחיצה
scrollLeftBtn.addEventListener('click', () => {
  storiesContainer.scrollBy({ left: -storyWidth * 3, behavior: 'smooth' });
});

// מאזין לגלילה כדי להסתיר ולהציג כפתורים
storiesContainer.addEventListener('scroll', () => {
  if (storiesContainer.scrollLeft <= 0) {
    scrollLeftBtn.style.display = 'none';
  } else {
    scrollLeftBtn.style.display = 'flex';
  }

  if (storiesContainer.scrollWidth - storiesContainer.clientWidth - storiesContainer.scrollLeft <= 1) {
    scrollRightBtn.style.display = 'none';
  } else {
    scrollRightBtn.style.display = 'flex';
  }
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
    const isModalBtn = btn.closest(".modal-footer-static") !== null;
    const post = isModalBtn ? window.currentPostInModal : btn.closest(".post");

    if (!post) return;

    const saveBtnInPost = post.querySelector(".post-actions .save");
    const saveBtnInModal = document.querySelector(".modal-footer-static .save");

    const emptyIcon = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png";
    const fullIcon = "https://static.thenounproject.com/png/bookmark-icon-809340-512.png";

    const isSaved = btn.classList.contains("saved");

    if (isSaved) {
      saveBtnInPost?.classList.remove("saved");
      saveBtnInPost.src = emptyIcon;

      saveBtnInModal?.classList.remove("saved");
      saveBtnInModal.src = emptyIcon;
    } else {
      saveBtnInPost?.classList.add("saved");
      saveBtnInPost.src = fullIcon;

      saveBtnInModal?.classList.add("saved");
      saveBtnInModal.src = fullIcon;
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

  // חיפוש לפי פילטר
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

    // --- חיפוש בפוסטים בלבד
    const posts = document.querySelectorAll('.posts-wrapper .post');
    const storiesContainer = document.querySelector('.stories-container'); // שמירה על הסטורייס
    const sidebarRight = document.querySelector('.sidebar-right'); // שמירה על הסיידבאר הימני
    const cfilter = document.querySelector('.custom-filter');
    let anyVisible = false;
    let hiddenCount = 0;
    let firstMatch = null;

    posts.forEach((post) => {
      const shortText = post.querySelector('.short-text')?.textContent.toLowerCase() || "";
      const fullText = post.querySelector('.full-text')?.textContent.toLowerCase() || "";
      const description = shortText + " " + fullText;

      if (selectedFilter === 'description') {
        const isMatch = description.includes(query);
        
        if (isMatch) {
          post.style.display = "block";
          if (!firstMatch) {
            firstMatch = post;
          }
          anyVisible = true;
        } else {
          post.style.display = "none";
          hiddenCount++;
        }
      } else {
        post.style.display = "";
        anyVisible = true;
      }
    });

    // ודא שהסטורייס נשארים גלויים
    if (storiesContainer) storiesContainer.style.display = "";

    // ודא שהסיידבאר הימני לא מוסתר
    if (sidebarRight) sidebarRight.style.display = "";

    // הצגת הפילטר רק אם יש פוסט מוצג
    if (anyVisible && firstMatch) {
      const moreOptions = firstMatch.querySelector('.more-options');
      if (moreOptions) {
        cfilter.style.visibility = "visible";  // מציג את הפילטר
      }
    } else {
      cfilter.style.visibility = "hidden"; // מסתיר את הפילטר אבל שומר על המרחב
    }

    // עדכון קלאסים לפי מספר ההסתרות
    sidebarRight.classList.remove('hide-0', 'hide-1', 'hide-2', 'hide-3plus');

    // if (hiddenCount === 0) {
    //   sidebarRight.classList.add('hide-0');
    // } else if (hiddenCount === 1) {
    //   sidebarRight.classList.add('hide-1');
    // } else if (hiddenCount === 2) {
    //   sidebarRight.classList.add('hide-2');
    // } else if (hiddenCount >= 3) {
    //   sidebarRight.classList.add('hide-3plus');
    // }

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
  
/// comment feature
const commentData = {};

// רשימת משתמשים מדומים ותמונות פרופיל
const dummyUsers = [
  { username: "ariel_yeshurun", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { username: "shira_katz", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { username: "david_gold", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
  { username: "aya_cohen", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { username: "tal_levi", avatar: "https://randomuser.me/api/portraits/men/77.jpg" },
  { username: "neta_friedman", avatar: "https://randomuser.me/api/portraits/women/28.jpg" },
  { username: "ido_barak", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
  { username: "lior_golan", avatar: "https://randomuser.me/api/portraits/men/20.jpg" },
  { username: "moran_shaked", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { username: "or_cohen", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
];

const dummyTexts = [
  "Awesome post!",
  "Really love this picture.",
  "Thanks for sharing!",
  "Such a cool post!",
  "Amazing, so beautiful.",
  "Love this place!",
  "Inspiring content.",
  "Great to see this here.",
  "Keep up the great work!",
  "Fantastic post, thanks!",
];

document.querySelectorAll('.view-comments-text').forEach(viewBtn => {
  viewBtn.addEventListener('click', () => {
    const post = viewBtn.closest('.post');
    if (!post) return;

    // מזהה הפוסט
    const postId = post.id || post.getAttribute('data-post-id');
    window.currentPostInModal = post;

    // פרטי הפוסט למודל
    const postImageEl = post.querySelector('.post-image img');
    const postImageSrc = postImageEl ? postImageEl.src : '';

    const userAvatarEl = post.querySelector('.user-avatar');
    const userAvatarSrc = userAvatarEl ? userAvatarEl.src : '';

    const usernameEl = post.querySelector('.user-name');
    const username = usernameEl ? usernameEl.textContent : '';

    const postLikesEl = post.querySelector('.likes-count');
    const modalLikesEl = document.querySelector('.modal-likes-count');
    if (postLikesEl && modalLikesEl) {
      modalLikesEl.textContent = postLikesEl.textContent;
    }

    const descriptionEl = post.querySelector('.post-text .full-text');
    const description = descriptionEl ? descriptionEl.textContent : '';

    const modal = document.querySelector('.comment-modal');

    // עדכון מידע בפנים המודל
    modal.querySelectorAll('.modal-user-avatar').forEach(el => el.src = userAvatarSrc);
    modal.querySelectorAll('.modal-username').forEach(el => el.textContent = username);
    const descriptionTarget = modal.querySelector('.modal-post-description');
    if (descriptionTarget) descriptionTarget.textContent = description;
    modal.querySelector('.modal-post-image').src = postImageSrc;
    modal.querySelector('textarea').value = '';

    modal.setAttribute('data-post-id', postId); // לשימוש בעת הוספת תגובה

    // ניקוי תגובות ישנות לפני טעינה
    const commentsList = modal.querySelector('.comments-list');

      commentsList.querySelectorAll('.comment-item:not(.writing)').forEach(el => el.remove());

    // טען תגובות אמיתיות ששמרנו
    const postComments = commentData[postId] || [];
    postComments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment-item';
      commentEl.innerHTML = `
        <img src="${comment.avatar}" alt="${comment.username}" class="comment-avatar">
        <div class="comment-content">
          <span class="comment-username">${comment.username}</span>
          <span class="comment-text">${comment.text}</span>
        </div>
      `;
      commentsList.appendChild(commentEl);
    });

    // מספר כולל תגובות בפוסט (מתוך הטקסט של view comments)
    const viewCommentsText = viewBtn.textContent || '';
    const match = viewCommentsText.match(/\d+/);
    const totalCommentsCount = match ? parseInt(match[0], 10) : 0;

    // חשב כמה תגובות מדומות צריך להוסיף כדי להשלים את המספר
    const dummyCount = totalCommentsCount - postComments.length;

    for (let i = 0; i < dummyCount; i++) {
      const user = dummyUsers[i % dummyUsers.length];
      const text = dummyTexts[i % dummyTexts.length];

      const dummyCommentEl = document.createElement('div');
      dummyCommentEl.className = 'comment-item';
      dummyCommentEl.innerHTML = `
        <img src="${user.avatar}" alt="${user.username}" class="comment-avatar">
        <div class="comment-content">
          <span class="comment-username">${user.username}</span>
          <span class="comment-text">${text}</span>
        </div>
      `;
      commentsList.appendChild(dummyCommentEl);
    }

    // סנכרון לייק ושמירה
    const originalLikeBtn = post.querySelector('.post-actions .like');
    const modalLikeBtn = document.querySelector('.modal-footer-static .like');
    const isLiked = originalLikeBtn.classList.contains('liked');
    modalLikeBtn.classList.toggle('liked', isLiked);
    modalLikeBtn.src = isLiked
      ? "https://cdn-icons-png.flaticon.com/256/2107/2107845.png"
      : "https://cdn-icons-png.flaticon.com/256/130/130195.png";

    const originalSaveBtn = post.querySelector('.post-actions .save');
    const modalSaveBtn = document.querySelector('.modal-footer-static .save');
    const isSaved = originalSaveBtn.classList.contains('saved');
    modalSaveBtn.classList.toggle('saved', isSaved);
    modalSaveBtn.src = isSaved
      ? "https://static.thenounproject.com/png/bookmark-icon-809340-512.png"
      : "https://static.thenounproject.com/png/bookmark-icon-809338-512.png";

    // פתח את המודל
    openCommentModal();
  });
});


function openCommentModal() {
    const sidebar = document.querySelector('.sidebar-left');
  const scrollBtn = document.querySelector('#scrollToTopBtn');
  

  const modal = document.querySelector('.comment-modal');
  modal.style.display = 'flex';
    setTimeout(() => {
    modal.classList.add('active');
      if (sidebar) sidebar.classList.add('dimmable', 'dimmed');
      if (scrollBtn) scrollBtn.classList.add('dimmable', 'dimmed');
  }, 10);

    sidebar.style.pointerEvents = 'none';

    setupModalSaveListener();

}

function closeCommentModal() {
  const modal = document.querySelector('.comment-modal');
  modal.classList.remove('active');
    setTimeout(() => {
    modal.style.display = 'none';
  }, 150);

  const sidebar = document.querySelector('.sidebar-left');
  const scrollBtn = document.querySelector('#scrollToTopBtn');
  if (sidebar) sidebar.classList.remove('dimmed');
  if (scrollBtn) scrollBtn.classList.remove('dimmed');
    sidebar.style.pointerEvents = 'all';

}

// מאזין ללחיצות על אייקוני תגובה
// מאזין ללחיצה על אייקון תגובה
document.querySelectorAll('.comment').forEach(commentBtn => {
  commentBtn.addEventListener('click', () => {
    const post = commentBtn.closest('.post');
    window.currentPostInModal = post;            // שמירת הפוסט הפעיל
    const modal = document.querySelector('.comment-modal');

    /* === 1. קופי מידע בסיסי (תמונה, אווטאר, שם, תיאור) === */
    modal.querySelector('.modal-post-image').src =
      post.querySelector('.post-image img')?.src || '';

    const avatarSrc = post.querySelector('.user-avatar')?.src || '';
    modal.querySelectorAll('.modal-user-avatar').forEach(i => (i.src = avatarSrc));

    const username = post.querySelector('.user-name')?.textContent || '';
    modal.querySelectorAll('.modal-username').forEach(u => (u.textContent = username));

    modal.querySelector('.modal-post-description').textContent =
      post.querySelector('.post-text .full-text')?.textContent || '';

    /* === 2. סנכרון ספירת הלייקים === */
    const postLikesEl  = post.querySelector('.likes-count');
    const modalLikesEl = modal.querySelector('.modal-likes-count');
    modalLikesEl.textContent = postLikesEl ? postLikesEl.textContent : '0 likes';

    /* === 3. סנכרון מצב LIKE / SAVE === */
    const modalLikeBtn = modal.querySelector('.modal-footer-static .like');
    const modalSaveBtn = modal.querySelector('.modal-footer-static .save');

    const feedLikeBtn = post.querySelector('.post-actions .like');
    const feedSaveBtn = post.querySelector('.post-actions .save');

    // --- Like
    const liked = feedLikeBtn.classList.contains('liked');
    modalLikeBtn.classList.toggle('liked', liked);
    modalLikeBtn.src = liked
      ? 'https://cdn-icons-png.flaticon.com/256/2107/2107845.png'   // לב מלא
      : 'https://cdn-icons-png.flaticon.com/256/130/130195.png';    // לב ריק



// קבלת מזהה הפוסט
const postId = post.id || post.getAttribute('data-post-id');
modal.setAttribute('data-post-id', postId);

        const commentsList = modal.querySelector('.comments-list');
commentsList.querySelectorAll('.comment-item:not(.writing)').forEach(el => el.remove());



// טעינת תגובות שמורות מהזיכרון
const postComments = commentData[postId] || [];
postComments.forEach(comment => {
  const commentEl = document.createElement('div');
  commentEl.className = 'comment-item';
  commentEl.innerHTML = `
    <img src="${comment.avatar}" alt="${comment.username}" class="comment-avatar">
    <div class="comment-content">
      <span class="comment-username">${comment.username}</span>
      <span class="comment-text">${comment.text}</span>
    </div>
  `;
  commentsList.appendChild(commentEl);
});

 const viewCommentsEl = post.querySelector('.view-comments-text');
    const viewCommentsText = viewCommentsEl ? viewCommentsEl.textContent : '';
    const match = viewCommentsText ? viewCommentsText.match(/\d+/) : null;
    const totalCommentsCount = match ? parseInt(match[0], 10) : 0;

    // רשימת משתמשים מדומים ותמונות פרופיל
    const dummyUsers = [
      { username: "ariel_yeshurun", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { username: "shira_katz", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { username: "david_gold", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
      { username: "aya_cohen", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
      { username: "tal_levi", avatar: "https://randomuser.me/api/portraits/men/77.jpg" },
      { username: "neta_friedman", avatar: "https://randomuser.me/api/portraits/women/28.jpg" },
      { username: "ido_barak", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
      { username: "lior_golan", avatar: "https://randomuser.me/api/portraits/men/20.jpg" },
      { username: "moran_shaked", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
      { username: "or_cohen", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
    ];

    const dummyTexts = [
      "Awesome post!",
      "Really love this picture.",
      "Thanks for sharing!",
      "Such a cool post!",
      "Amazing, so beautiful.",
      "Love this place!",
      "Inspiring content.",
      "Great to see this here.",
      "Keep up the great work!",
      "Fantastic post, thanks!",
    ];

    // חשב כמה תגובות מדומות להוסיף כדי להשלים למספר התגובות הכולל
    const dummyCount = totalCommentsCount - postComments.length;

    for (let i = 0; i < dummyCount; i++) {
      const user = dummyUsers[i % dummyUsers.length];
      const text = dummyTexts[i % dummyTexts.length];

      const dummyCommentEl = document.createElement('div');
      dummyCommentEl.className = 'comment-item';
      dummyCommentEl.innerHTML = `
        <img src="${user.avatar}" alt="${user.username}" class="comment-avatar">
        <div class="comment-content">
          <span class="comment-username">${user.username}</span>
          <span class="comment-text">${text}</span>
        </div>
      `;
      commentsList.appendChild(dummyCommentEl);
    }


function updateModalSaveState() {
  if (!window.currentPostInModal) return;

  const post = window.currentPostInModal;
  const feedSaveBtn = post.querySelector('.post-actions .save');

  if (!modalSaveBtn || !feedSaveBtn) return;

  const fullSaveIcon = "https://static.thenounproject.com/png/bookmark-icon-809340-512.png"; // מלא
  const emptySaveIcon = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png"; // ריק

  const isCurrentlySaved = feedSaveBtn.classList.contains("saved");

  modalSaveBtn.classList.toggle("saved", isCurrentlySaved);
  modalSaveBtn.src = isCurrentlySaved ? fullSaveIcon : emptySaveIcon;
}

if (modalSaveBtn) {
  modalSaveBtn.addEventListener('click', () => {
    if (!window.currentPostInModal) return;

    const post = window.currentPostInModal;
    const feedSaveBtn = post.querySelector('.post-actions .save');

    if (!modalSaveBtn || !feedSaveBtn) return;

    const fullSaveIcon = "https://static.thenounproject.com/png/bookmark-icon-809340-512.png"; // מלא
    const emptySaveIcon = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png"; // ריק

    const isCurrentlySaved = feedSaveBtn.classList.contains("saved");

    if (isCurrentlySaved) {
      // הסרה מהמודל ומהפוסט
      feedSaveBtn.classList.remove("saved");
      modalSaveBtn.classList.remove("saved");
      feedSaveBtn.src = emptySaveIcon;
      modalSaveBtn.src = emptySaveIcon;
    } else {
      // סימון כשמור במודל ובפוסט
      feedSaveBtn.classList.add("saved");
      modalSaveBtn.classList.add("saved");
      feedSaveBtn.src = fullSaveIcon;
      modalSaveBtn.src = fullSaveIcon;
    }
  });
}



    /* === 4. איפוס שדה תגובה ופתיחת המודל === */
    modal.querySelector('textarea').value = '';

    openCommentModal();   // פונקציית הפתיחה הקיימת שלך
        setupModalSaveListener();
  });
});

// סגירת המודל בלחיצה מחוץ
document.querySelector('.comment-modal').addEventListener('click', e => {
  if (e.target.classList.contains('comment-modal')) {
    closeCommentModal();
  }
});

// סגירת המודל בלחיצה על כפתור סגירה
const modalCloseBtn = document.querySelector('.modal-close');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    closeCommentModal();
  });
}

const commentTextarea = document.querySelector('.comment-input textarea');
const sendButton = document.querySelector('.comment-input button.send-comment');

commentTextarea.addEventListener('input', () => {
  if (commentTextarea.value.trim().length > 0) {
    sendButton.classList.add('enabled');
    sendButton.disabled = false;
  } else {
    sendButton.classList.remove('enabled');
    sendButton.disabled = true;
  }
});

// אתחל את המצב בתחילה
sendButton.disabled = true;
sendButton.classList.remove('enabled');
let openedFrom = null; // "modal" או "post"

const emojiButton = document.querySelector('.emoji-button');
const emojiPicker = document.getElementById('emoji-picker');
const modalTextarea = document.querySelector('.comment-input textarea');

// פתיחה מהמודל
emojiButton.addEventListener('click', (e) => {
  e.stopPropagation();
  openedFrom = 'modal';

  emojiPicker.style.display = (emojiPicker.style.display === 'none' || emojiPicker.style.display === '') ? 'block' : 'none';

  // עיצוב רוחב תפריט למודל
  emojiPicker.style.width = '250px'; // רוחב גדול

  window.activeTextarea = modalTextarea;

  // מיקום למרכז או לפי הצורך במודל
  emojiPicker.style.top = '';
  emojiPicker.style.left = '';
});
  
// פתיחה מהפוסט
document.querySelectorAll('.comment-section .emoji').forEach(icon => {
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    openedFrom = 'post';
    
    const feed = document.querySelector('.feed');  // שליפה נכונה של הפיד
    const commentSection = icon.closest('.comment-section');
    const postTextarea = commentSection.querySelector('textarea');
    window.activeTextarea = postTextarea;

    const rect = icon.getBoundingClientRect();
    emojiPicker.style.top = `${500 + window.scrollY}px`; // תיקון חיבור מחרוזת למספר
    emojiPicker.style.left = `${rect.left + window.scrollX}px`;
    emojiPicker.style.display = 'block';

    emojiPicker.style.width = '350px';
    emojiPicker.style.height = '350px';

    feed.classList.add('no-scroll'); // הוספת חסימת גלילה על הפיד
  });
});

// הכנסת האימוג'י לתיבת הטקסט - בלי שינוי
emojiPicker.querySelectorAll('.emoji-item').forEach(emoji => {
  emoji.addEventListener('click', () => {
    const textarea = window.activeTextarea;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.substring(0, start) + emoji.textContent + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + emoji.textContent.length;

    emojiPicker.style.display = 'none';

    const feed = document.querySelector('.feed');
    feed.classList.remove('no-scroll'); // הסרת חסימת גלילה לאחר סגירת הפיקר

    window.activeTextarea = null;
    textarea.dispatchEvent(new Event('input'));
  });
});

// סגירת תפריט בלחיצה מחוץ
document.addEventListener('click', (e) => {
  const feed = document.querySelector('.feed');
  const emojiIcons = [...document.querySelectorAll('.comment-section .emoji')];

  if (!emojiPicker.contains(e.target) && !emojiIcons.some(icon => icon === e.target)) {
    emojiPicker.style.display = 'none';
    feed.classList.remove('no-scroll'); // הסרת חסימת גלילה

    window.activeTextarea = null;
  }
});

const modalLikeBtn = document.querySelector('.modal-footer-static .like');
const modalSaveBtn = document.querySelector('.modal-footer-static .save');
const modalLikesCount = document.querySelector('.modal-likes-count');


if (modalLikeBtn) {
  modalLikeBtn.addEventListener('click', () => {
    if (!window.currentPostInModal) return;

    const post = window.currentPostInModal;
    const originalLikeBtn = post.querySelector('.post-actions .like');
    const originalLikesCountSpan = post.querySelector('.likes-count');
    

    let currentLikes = parseInt(originalLikesCountSpan.textContent.replace(/[^\d]/g, '')) || 0;
    const isLiked = modalLikeBtn.classList.contains("liked");

    if (!isLiked) {
      modalLikeBtn.src = "https://cdn-icons-png.flaticon.com/256/2107/2107845.png"; // full heart
      originalLikeBtn.src = "https://cdn-icons-png.flaticon.com/256/2107/2107845.png";
      modalLikeBtn.classList.add("liked");
      originalLikeBtn.classList.add("liked");
      currentLikes++;
    } else {
      modalLikeBtn.src = "https://cdn-icons-png.flaticon.com/256/130/130195.png"; // empty heart
      originalLikeBtn.src = "https://cdn-icons-png.flaticon.com/256/130/130195.png";
      modalLikeBtn.classList.remove("liked");
      originalLikeBtn.classList.remove("liked");
      currentLikes = Math.max(0, currentLikes - 1);
    }

    modalLikesCount.textContent = `${currentLikes.toLocaleString()} likes`;
    originalLikesCountSpan.textContent = `${currentLikes.toLocaleString()} likes`;

    modalLikeBtn.classList.add("pop");
    setTimeout(() => modalLikeBtn.classList.remove("pop"), 300);
  });
}

if (modalSaveBtn) {
  modalSaveBtn.addEventListener('click', () => {
    if (!window.currentPostInModal) return;

    const post = window.currentPostInModal;
    const originalSaveBtn = post.querySelector('.post-actions .save');
    const isSaved = modalSaveBtn.classList.contains("saved");

    if (!isSaved) {
      modalSaveBtn.src = "https://static.thenounproject.com/png/bookmark-icon-809340-512.png"; // סימון שמור
      originalSaveBtn.src = "https://static.thenounproject.com/png/bookmark-icon-809340-512.png";
      modalSaveBtn.classList.add("saved");
      originalSaveBtn.classList.add("saved");
    } else {
      modalSaveBtn.src = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png"; // לא שמור
      originalSaveBtn.src = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png";
      modalSaveBtn.classList.remove("saved");
      originalSaveBtn.classList.remove("saved");
    }
  });
}

function setupModalSaveListener() {
  const modalSaveBtn = document.querySelector('.modal-footer-static .save');
  if (!modalSaveBtn) return;

  // קודם נבטל מאזין קודם אם יש (למנוע כפילויות)
  modalSaveBtn.replaceWith(modalSaveBtn.cloneNode(true));
  const newModalSaveBtn = document.querySelector('.modal-footer-static .save');

  newModalSaveBtn.addEventListener('click', () => {
    if (!window.currentPostInModal) return;

    const post = window.currentPostInModal;
    const feedSaveBtn = post.querySelector('.post-actions .save');

    const fullSaveIcon = "https://static.thenounproject.com/png/bookmark-icon-809340-512.png";
    const emptySaveIcon = "https://static.thenounproject.com/png/bookmark-icon-809338-512.png";

    const isCurrentlySaved = feedSaveBtn.classList.contains("saved");

    if (isCurrentlySaved) {
      feedSaveBtn.classList.remove("saved");
      newModalSaveBtn.classList.remove("saved");
      feedSaveBtn.src = emptySaveIcon;
      newModalSaveBtn.src = emptySaveIcon;
    } else {
      feedSaveBtn.classList.add("saved");
      newModalSaveBtn.classList.add("saved");
      feedSaveBtn.src = fullSaveIcon;
      newModalSaveBtn.src = fullSaveIcon;
    }
  });
}
const modal1 = document.querySelector('.comment-modal');
const modalTextarea1 = modal1.querySelector('textarea');
const writingIndicator = modal1.querySelector('.comment-item.writing');


modalTextarea1.addEventListener('input', () => {
  if (modalTextarea1.value.trim()) {
    writingIndicator.style.display = 'flex';
  } else {
    writingIndicator.style.display = 'none';
  }
});

function showToast(toastElement) {
  toastElement.classList.remove('toast-hidden');
  toastElement.classList.add('toast-show');

  setTimeout(() => {
    toastElement.classList.remove('toast-show');
    toastElement.classList.add('toast-hidden');
  }, 1500);
}

document.querySelectorAll('.send-comment').forEach(button => {
  button.addEventListener('click', () => {
    const commentInput = button.closest('.comment-input');
    const textarea = commentInput.querySelector('textarea');
    const text = textarea.value.trim();
    if (!text) return;

    const modal = document.querySelector('.comment-modal');
    const postId = modal.getAttribute('data-post-id'); // משייך לפוסט פתוח

    const commentsList = modal.querySelector('.comments-list');
    const writingIndicator = modal.querySelector('.comment-item.writing');


    // נתונים של המשתמש הנוכחי
    const userProfilePic = "https://cdn-icons-png.flaticon.com/512/12225/12225935.png";
    const username = "_ron_lhayanie";

    // יצירת אלמנט תגובה
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item';
    commentEl.innerHTML = `
      <img src="${userProfilePic}" alt="${username}" class="comment-avatar">
      <div class="comment-content">
        <span class="comment-username">${username}</span>
        <span class="comment-text">${text}</span>
      </div>
    `;

    commentsList.prepend(writingIndicator);
    commentsList.insertBefore(commentEl, writingIndicator.nextSibling);

    // שמירה במבנה תגובות
    if (!commentData[postId]) {
      commentData[postId] = [];
    }
    commentData[postId].unshift({
      username,
      avatar: userProfilePic,
      text
    });

    // איפוס התיבה
    textarea.value = "";
    textarea.dispatchEvent(new Event('input'));
// עדכון טקסט view comments
const viewComments = window.currentPostInModal?.querySelector('.view-comments-text');
if (viewComments) {
  const match = viewComments.textContent.match(/\d+/);
  const base = match ? parseInt(match[0], 10) : 0;
  const total = base + 1;

  viewComments.textContent = `View all ${total} comments`;
}

    const toastComment = document.getElementById('toast-comment');
    showToast(toastComment);
  });
});

document.querySelectorAll('.post-button').forEach(postBtn => {
  postBtn.addEventListener('click', () => {
    const commentRow = postBtn.closest('.comment-row');
    const textarea = commentRow.querySelector('.add-comment-box');
    const text = textarea.value.trim();
    if (!text) return;

    const post = postBtn.closest('.post');
    const postId = post.id || post.getAttribute('data-post-id');
    if (!postId) return;

    // תגובה חדשה
    const userProfilePic = "https://cdn-icons-png.flaticon.com/512/12225/12225935.png";
    const username = "_ron_lhayanie";

    const newComment = {
      username,
      avatar: userProfilePic,
      text
    };

    // הוספה לזיכרון
    if (!commentData[postId]) {
      commentData[postId] = [];
    }
    commentData[postId].unshift(newComment);

    // איפוס שדה הטקסט
    textarea.value = "";
    textarea.dispatchEvent(new Event('input'));

    // עדכון טקסט view all X comments
    const viewComments = post.querySelector('.view-comments-text');
    if (viewComments) {
      const baseText = viewComments.textContent || '';
      const match = baseText.match(/\d+/);
      const currentCount = match ? parseInt(match[0], 10) : 0;
      const total = currentCount + 1;
      viewComments.textContent = `View all ${total} comments`;
    }
        const toastComment = document.getElementById('toast-comment');
    showToast(toastComment);
  });



});

/// Share modal

const shareBtns = document.querySelectorAll('.share');   // e.g. icon under each post
const FROMSHAREsidebarLeft = document.querySelector('.sidebar-left');
const FROMSHAREscrollToTopBtn = document.querySelector('#scrollToTopBtn');
// 1.2  CORE MODAL ELEMENTS
const sharemodal       = document.querySelector('.share-modal');
const shareoverlay      = document.querySelector('.share-overlay');
const sharecloseBtn    = sharemodal.querySelector('.close-share-modal');
const bottomMenu  = sharemodal.querySelector('.share-bottom-menu');
const sendBox     = sharemodal.querySelector('.send-box');
const users       = sharemodal.querySelectorAll('.user-item');

// 1.3  **UNIQUE SHARE-ACTION BUTTONS INSIDE THE BOTTOM MENU**
const copyBtn      = document.getElementById('share-copy');
const facebookBtn  = document.getElementById('share-facebook');
const messengerBtn = document.getElementById('share-messenger');
const whatsappBtn  = document.getElementById('share-whatsapp');
const emailBtn     = document.getElementById('share-email');
const xBtn         = document.getElementById('share-x');

/* ===== 2. MODAL OPEN / CLOSE ===== */

function opensharemodal() {
  // מציג את האובראליי ומאפס שקיפות
  const leftsidebar = document.querySelector('.sidebar-left');
  leftsidebar.style.pointerEvents = 'none';
  shareoverlay.style.display = 'flex';
  shareoverlay.style.opacity = '0';
 shareoverlay.style.pointerEvents = 'none';


  // מוודא שהאובראליי יתאנמץ בשקיפות חלקה
  setTimeout(() => {
    shareoverlay.style.opacity = '1';
    shareoverlay.style.pointerEvents = 'auto';
      FROMSHAREsidebarLeft?.classList.add('dimmable', 'dimmed');
  FROMSHAREscrollToTopBtn?.classList.add('dimmable', 'dimmed');
  }, 10);

  // מוסיף מחלקות להחשכה חלקה של האלמנטים


  // תצוגת הממשק במודל
  bottomMenu.style.display = 'flex';
  sendBox.style.display = 'none';
  users.forEach(u => u.classList.remove('selected'));
}

// האזנה לפתיחת המודל
shareBtns.forEach(btn => btn.addEventListener('click', opensharemodal));



// סגירת המודל והסרת החשכה
sharecloseBtn.addEventListener('click', () => {
  // שקיפות יורדת
  const sidebar = document.querySelector('.sidebar-left');


  shareoverlay.style.opacity = '0';
  shareoverlay.style.pointerEvents = 'none';
  
  // מחכה לסיום האנימציה ואז מסתיר
  setTimeout(() => {
    shareoverlay.style.display = 'none';

  }, 150); // תואם ל-transition ב-CSS

      FROMSHAREsidebarLeft?.classList.remove('dimmed');
  FROMSHAREscrollToTopBtn?.classList.remove('dimmed');
    sidebar.style.pointerEvents = 'all'
  

});

shareoverlay.addEventListener('click', (e) => {
  const sidebar = document.querySelector('.sidebar-left');
  if (e.target === shareoverlay) {
    // מבצע סגירה כמו כפתור ה-X
    shareoverlay.style.opacity = '0';
    shareoverlay.style.pointerEvents = 'none';

    setTimeout(() => {
      shareoverlay.style.display = 'none';
    }, 150);

    FROMSHAREsidebarLeft?.classList.remove('dimmed');
    FROMSHAREscrollToTopBtn?.classList.remove('dimmed');
    sidebar.style.pointerEvents = 'all'
  }
});

/* ===== 3. USER SELECTION TOGGLE ===== */

users.forEach(user => {
  user.addEventListener('click', () => {
    // exclusive selection (click again to unselect)
    if (user.classList.contains('selected')) {
      user.classList.remove('selected');
    } else {
      users.forEach(u => u.classList.remove('selected'));
      user.classList.add('selected');
    }

    const anySelected = [...users].some(u => u.classList.contains('selected'));
    bottomMenu.style.display = anySelected ? 'none'  : 'flex';
    sendBox.style.display    = anySelected ? 'flex'  : 'none';
  });
});


const shareSearchInput = document.querySelector('#shareUserSearch');
const userGrid = document.querySelector('.user-grid');
const userItems = userGrid.querySelectorAll('.user-item');
const noResults = document.querySelector('.no-results'); // עדיף לוודא שזה לא בתוך user-grid

shareSearchInput.addEventListener('input', () => {
  const searchTerm = shareSearchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  userItems.forEach(user => {
    const username = user.dataset.username?.toLowerCase() || '';
    const isVisible = username.includes(searchTerm);
    user.style.display = isVisible ? '' : 'none'; // ריק = ברירת מחדל, אין צורך ב-'flex'/'block'
    if (isVisible) visibleCount++;
  });

  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
});

const sharesendBox = document.querySelector('.send-box');
const sharesendButton = document.querySelector('.send-button');
const sharecheckmarks = document.querySelectorAll('.checkmark');
const shareBottomMenu = document.querySelector('.share-bottom-menu');
const shareuserItems = document.querySelectorAll('.user-item');
const toastMessage = document.getElementById('toast-message');

function updateSendBoxVisibility() {
  const anyChecked = Array.from(sharecheckmarks).some(mark => mark.style.display === 'block');

  if (anyChecked) {
    sharesendBox.style.display = 'flex';
    shareBottomMenu.style.display = 'none';
  } else {
    sharesendBox.style.display = 'none';
    shareBottomMenu.style.display = 'flex';
  }
}

shareuserItems.forEach(user => {
  user.addEventListener('click', () => {
    const checkmark = user.querySelector('.checkmark');
    if (checkmark.style.display === 'block') {
      checkmark.style.display = 'none';
    } else {
      checkmark.style.display = 'block';
    }
    updateSendBoxVisibility();
  });
});

// הגדרת מצב התחלתי
updateSendBoxVisibility();

sharesendButton.addEventListener('click', () => {
  // ניקוי תוכן הטקסטאריאה
  sharesendBox.querySelector('textarea').value = '';

  // הסתרת תיבת השליחה
  sharesendBox.style.display = 'none';

  // הצגת התפריט התחתון
  shareBottomMenu.style.display = 'flex';

  // הסרת כל הצ'קמרקים
  sharecheckmarks.forEach(mark => {
    mark.style.display = 'none';
  });

  // עדכון תצוגת תיבת השליחה / תפריט תחתון
  updateSendBoxVisibility();

  // הצגת הודעת האישור החיצונית - toast
  toastMessage.classList.remove('toast-hidden');
  toastMessage.classList.add('toast-show');

  // הסתרת ההודעה לאחר 1.5 שניות
  setTimeout(() => {
    toastMessage.classList.remove('toast-show');
    toastMessage.classList.add('toast-hidden');
  }, 1500);
});

/// create-post-modal



const mainfeed = document.querySelector('.posts-wrapper');
const notice = document.getElementById('new-post-notice');
const createBtn = document.getElementById('create-post-button');

if (!mainfeed || !createBtn) {
  console.error('Missing required elements');
}

const createModal = document.createElement('div');
createModal.className = 'create-post-modal';
createModal.innerHTML = `
<link rel="stylesheet" href="styles.css">

<div class="create-post-overlay" id="createModal">
  <button id="close-create-modal">×</button>
  <div class="modal-instagram-layout">
    <!-- Left Side: Image -->
    <div class="post-image-side">
      <img id="post-image-preview" src="" alt="Preview" style="display: none;" />
      <div class="upload-options" id="upload-options">
        <button class="upload-file-btn" onclick="document.getElementById('upload-file').click()">Upload a File</button>
        <input type="file" id="upload-file" accept="image/*" style="display: none;" />
        <input type="url" id="upload-url" placeholder="Paste image URL" />
      </div>
      <button class="close-image" id="close-image" style="display: none;">×</button>
      <div class="error-message" id="error-message"></div>
    </div>

    <!-- Right Side: Post Form -->
    <div class="post-form-side">
      <!-- Header -->
      <div class="post-form-header">Create new post</div>

      <!-- User Info -->
      <div class="post-user-info">
        <img src="https://cdn-icons-png.flaticon.com/512/12225/12225935.png" alt="User Avatar" />
        <span>_ron_lhayanie</span>
      </div>

      <!-- Description Textarea + Emoji -->
      <div class="desc-with-emoji">
        <textarea id="new-post-desc" maxlength="2200" placeholder="Write a caption..."></textarea>
        <button class="create-unique-emoji-button">
          <svg aria-label="Emoji" class="emoji" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20">
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"/>
          </svg>
        </button>
      </div>

      <!-- Emoji Picker -->
      <div id="create-unique-emoji-picker" class="create-unique-emoji-picker" style="display:none; position:absolute; padding:10px; max-width:250px; max-height:150px; overflow:auto; z-index:1000;">
        <span class="emoji-item">😀</span>
        <span class="emoji-item">😃</span>
        <span class="emoji-item">😄</span>
        <span class="emoji-item">😁</span>
        <span class="emoji-item">😆</span>
        <span class="emoji-item">😂</span>
        <span class="emoji-item">🤣</span>
        <span class="emoji-item">😊</span>
        <span class="emoji-item">😍</span>
        <span class="emoji-item">😘</span>
        <span class="emoji-item">🥰</span>
        <span class="emoji-item">😎</span>
        <span class="emoji-item">🤔</span>
        <span class="emoji-item">😢</span>
        <span class="emoji-item">😭</span>
        <span class="emoji-item">😡</span>
        <span class="emoji-item">😱</span>
        <span class="emoji-item">👍</span>
        <span class="emoji-item">👎</span>
        <span class="emoji-item">👌</span>
        <span class="emoji-item">✌️</span>
        <span class="emoji-item">🙏</span>
        <span class="emoji-item">👏</span>
        <span class="emoji-item">💪</span>
        <span class="emoji-item">🖐️</span>
        <span class="emoji-item">🤝</span>
        <span class="emoji-item">❤️</span>
        <span class="emoji-item">🧡</span>
        <span class="emoji-item">💛</span>
        <span class="emoji-item">💚</span>
        <span class="emoji-item">💙</span>
        <span class="emoji-item">💜</span>
        <span class="emoji-item">🖤</span>
        <span class="emoji-item">💔</span>
        <span class="emoji-item">💖</span>
        <span class="emoji-item">💕</span>
        <span class="emoji-item">💞</span>
        <span class="emoji-item">🔥</span>
        <span class="emoji-item">🎉</span>
        <span class="emoji-item">🎊</span>
        <span class="emoji-item">✨</span>
        <span class="emoji-item">🌟</span>
        <span class="emoji-item">💫</span>
        <span class="emoji-item">🍀</span>
        <span class="emoji-item">🍕</span>
        <span class="emoji-item">🍔</span>
        <span class="emoji-item">🍟</span>
        <span class="emoji-item">🌮</span>
        <span class="emoji-item">🍩</span>
        <span class="emoji-item">🍦</span>
        <span class="emoji-item">🍎</span>
        <span class="emoji-item">🍉</span>
        <span class="emoji-item">🍫</span>
        <span class="emoji-item">☕</span>
        <span class="emoji-item">🥤</span>
        <span class="emoji-item">✔️</span>
        <span class="emoji-item">❌</span>
        <span class="emoji-item">⚠️</span>
        <span class="emoji-item">🔔</span>
        <span class="emoji-item">⭐</span>
        <span class="emoji-item">🌈</span>
        <span class="emoji-item">☀️</span>
        <span class="emoji-item">🌙</span>
        <span class="emoji-item">❄️</span>
        <span class="emoji-item">💤</span>
        <span class="emoji-item">🐶</span>
        <span class="emoji-item">🐱</span>
        <span class="emoji-item">🐻</span>
        <span class="emoji-item">🐼</span>
        <span class="emoji-item">🦊</span>
        <span class="emoji-item">🐨</span>
        <span class="emoji-item">🐸</span>
        <span class="emoji-item">🐧</span>
        <span class="emoji-item">🐥</span>
        <span class="emoji-item">🦄</span>
      </div>

      <!-- Location -->
      <div class="input-field-container">
        <input type="text" id="location-input" class="input-field" placeholder="Add location" list="places"/>
        <svg class="location-icon" aria-label="Add location" class="x1lliihq x1n2onr6 x1roi4f4" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Add location</title><path d="M12.053 8.105a1.604 1.604 0 1 0 1.604 1.604 1.604 1.604 0 0 0-1.604-1.604Zm0-7.105a8.684 8.684 0 0 0-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 0 0 1.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0 0 12.053 1Zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0 1 13.417 0c0 3.985-3.944 8.538-6.709 11.002Z"></path></svg>
        <div class="location-suggestions" id="places"></div>
      </div>

      <!-- Collaborators -->
      <div class="input-field-container">
        <input type="text" class="input-field" placeholder="Add collaborators" />
        <svg class="collaborator-icon" aria-label="Add collaborators" class="x1lliihq x1n2onr6 x1roi4f4" fill="#000000" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Add collaborators</title><path d="M21 10a1 1 0 0 0-1 1v9c0 .932-.643 1.71-1.507 1.931C18.429 19.203 16.199 17 13.455 17H8.55c-2.745 0-4.974 2.204-5.037 4.933A1.999 1.999 0 0 1 2 20V6c0-1.103.897-2 2-2h9a1 1 0 1 0 0-2H4C1.794 2 0 3.794 0 6v14c0 2.206 1.794 4 4 4h14c2.206 0 4-1.794 4-4v-9a1 1 0 0 0-1-1zM8.549 19h4.906a3.05 3.05 0 0 1 3.045 3H5.505a3.05 3.05 0 0 1 3.044-3z"></path><path d="M6.51 11.002c0 2.481 2.02 4.5 4.502 4.5 2.48 0 4.499-2.019 4.499-4.5s-2.019-4.5-4.5-4.5a4.506 4.506 0 0 0-4.5 4.5zm7 0c0 1.378-1.12 2.5-2.498 2.5-1.38 0-2.501-1.122-2.501-2.5s1.122-2.5 2.5-2.5a2.502 2.502 0 0 1 2.5 2.5zM23.001 3.002h-2.004V1a1 1 0 1 0-2 0v2.002H17a1 1 0 1 0 0 2h1.998v2.003a1 1 0 1 0 2 0V5.002h2.004a1 1 0 1 0 0-2z"></path></svg>
      </div>

<!-- Share to List -->
<div class="share-to">
  <strong>Share to</strong>
  <label>
    <span class="thread-icon-wrapper">
      <img src="https://cdn-icons-png.flaticon.com/512/12225/12225935.png" alt="Profile" class="profile-img" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="16" height="16" fill="currentColor" class="thread-svg" role="img" aria-label="Thread icon">
        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
      </svg>
      Threads
    </span>
    <span class="create-slider">
      <input type="checkbox" id="share-to-user">
      <span class="slider"></span>
    </span>
  </label>
  <label>
    <span><img src="https://img.icons8.com/?size=512&id=uLWV5A9vXIPu&format=png" alt="Facebook" class="fb-icon" />Facebook friends</span>
    <span class="create-slider">
      <input type="checkbox" id="share-to-fb">
      <span class="slider"></span>
    </span>
  </label>
</div>

      <!-- Accessibility -->
      <div class="section-toggle">
        <button class="toggle-accessibility"><span>Accessibility</span><svg class="arrow-down" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L6 6L11 1" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></button>
        <div class="accessibility-content" style="display: none;">
          <p>Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.</p>
          <input type="text" class="input-field" placeholder="Write alt text..." style="margin-top: 10px;" />
        </div>
      </div>

      <!-- Advanced Settings -->
      <div class="section-toggle">
        <button class="toggle-advanced"><span>Advanced Settings</span><svg class="arrow-down" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L6 6L11 1" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></button>
        <div class="advanced-settings-content">
          <label>
            <div class="setting-title">
              <span>Hide like and view counts on this post</span>
              <span class="create-slider"><input type="checkbox" id="hide-counts"><span class="slider"></span></span>
            </div>
            <p class="setting-desc">Only you will see the total number of likes and views on this post. You can change this later by going to the ··· menu at the top of the post.</p>
          </label>
          <label>
            <div class="setting-title">
              <span>Turn off commenting</span>
              <span class="create-slider"><input type="checkbox" id="turn-off-comments"><span class="slider"></span></span>
            </div>
            <p class="setting-desc">You can change this later by going to the ··· menu at the top of your post.</p>
          </label>
          <label>
            <div class="setting-title">
              <span>Automatically share to Threads</span>
              <span class="create-slider"><input type="checkbox" id="share-to-threads"><span class="slider"></span></span>
            </div>
            <p class="setting-desc">Always share your posts to Threads. You can change your audience on Threads settings.</p>
          </label>
          <label>
            <div class="setting-title">
              <span>Automatically share to Facebook</span>
              <span class="create-slider"><input type="checkbox" id="share-to-fb-auto"><span class="slider"></span></span>
            </div>
            <p class="setting-desc">Always share your posts to Facebook. You can change your audience on Facebook settings.</p>
          </label>
        </div>
      </div>

      <!-- Submit -->
      <button id="submit-new-post" class="submit-button">Share</button>
    </div>
  </div>

  <div id="confirmation-overlay"></div>
  <!-- הודעת אישור לסגירה -->
<div class="confirmation-modal" id="confirmationModal">
  <p id="discardpostp">Discard post?</p>
  <p>If you leave, your edits won't be saved.</p>
  
  <div class="confirmation-button-container">
    <button class="discard-btn" id="discardBtn">Discard</button>
    <button class="cancel-btn" id="cancelBtn">Cancel</button>
  </div>
</div>
`;
document.body.appendChild(createModal);


const fileInput = createModal.querySelector('#upload-file');
const urlInput = createModal.querySelector('#upload-url');
const previewImg = createModal.querySelector('#post-image-preview');
const createEmojiBtn = createModal.querySelector('.create-unique-emoji-button');
const createEmojiPicker = createModal.querySelector('#create-unique-emoji-picker');
const textArea = createModal.querySelector('#new-post-desc');

function updatePreview(src) {
  const previewImg = createModal.querySelector('#post-image-preview');
  const uploadOptions = createModal.querySelector('#upload-options');
  const closeImage = createModal.querySelector('#close-image');
  const errorMessage = createModal.querySelector('#error-message');
  const uploadUrl = createModal.querySelector('#upload-url');

  previewImg.src = src;
  previewImg.style.display = 'block';
  uploadOptions.style.display = 'none';
  closeImage.style.display = 'block';
  errorMessage.style.display = 'none'; // איפוס הודעת שגיאה
  uploadUrl.style.border = 'none'; // איפוס הגבול למצב הרגיל המוגדר ב-CSS
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        updatePreview(e.target.result);
      };
      img.onerror = () => {
        const errorMessage = createModal.querySelector('#error-message');
        const uploadUrl = createModal.querySelector('#upload-url');
        errorMessage.textContent = 'Invalid image file. Please try again.';
        errorMessage.style.display = 'block';
        uploadUrl.style.border = '2px solid red'; // הגדרת גבול אדום בשגיאה
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

urlInput.addEventListener('input', () => {
  const url = urlInput.value.trim();
  const errorMessage = createModal.querySelector('#error-message');
  const uploadUrl = createModal.querySelector('#upload-url');
  const previewImg = createModal.querySelector('#post-image-preview');
  const uploadOptions = createModal.querySelector('#upload-options');
  const closeImage = createModal.querySelector('#close-image');

  if (url) {
    const img = new Image();
    img.onload = () => {
      updatePreview(url);
      uploadUrl.style.border = 'none'; // איפוס הגבול לאחר הצלחה
    };
    img.onerror = () => {
      errorMessage.textContent = 'Invalid image URL. Please try again.';
      errorMessage.style.display = 'block';
      uploadUrl.style.border = '2px solid red'; // הגדרת גבול אדום בשגיאה
    };
    img.src = url;
  } else {
    previewImg.style.display = 'none';
    uploadOptions.style.display = 'block';
    closeImage.style.display = 'none';
    errorMessage.style.display = 'none';
    uploadUrl.style.border = 'none'; // איפוס הגבול כאשר השדה ריק
  }
});

urlInput.addEventListener('input', () => {
  const url = urlInput.value.trim();
  if (url) {
    const img = new Image();
    img.onload = () => updatePreview(url);
    img.onerror = () => {
      createModal.querySelector('#error-message').textContent = 'Invalid image URL. Please try again.';
      createModal.querySelector('#error-message').style.display = 'block';
    };
    img.src = url;
  } else {
    previewImg.style.display = 'none';
    createModal.querySelector('#upload-options').style.display = 'block';
    createModal.querySelector('#close-image').style.display = 'none';
    createModal.querySelector('#error-message').style.display = 'none';
  }
});



const overlay = document.getElementById('createModal');

function closeModal() {
  sidebarLeft.style.pointerEvents = 'all';
  overlay.classList.remove('visible');
  createModal.classList.remove('visible');

  // מניעת קליקים בזמן האנימציה
  overlay.style.pointerEvents = 'none';
  createModal.style.pointerEvents = 'none';
    sidebarLeft.classList.remove('dimmed');
    sidebarLeft.classList.remove('dimmed-overlay');
 scrollBtn.classList.remove('dimmed');
  setTimeout(() => {
    overlay.style.display = 'none';
    createModal.style.display = 'none';
    overlay.style.pointerEvents = '';
    createModal.style.pointerEvents = '';
  }, 150);
}

// בדיקת שינויים והוספת הודעת אישור
let isChanged = false;
const formElements = [createModal.querySelector('#new-post-desc'), createModal.querySelector('#location-input'), ...createModal.querySelectorAll('input[type="checkbox"]'), createModal.querySelector('.accessibility-content .input-field')];
const originalValues = {};
formElements.forEach(element => {
  originalValues[element.id] = element.type === 'checkbox' ? element.checked : element.value;
});

function checkForChanges() {
  let changed = false;
  formElements.forEach(element => {
    if (element.type === 'checkbox') {
      if (element.checked !== originalValues[element.id]) changed = true;
    } 
    else if (element.value !== originalValues[element.id]) changed = true;
  });
  if (previewImg.style.display === 'block' && fileInput.files.length === 0 && !urlInput.value) changed = true;
  return changed;
}

formElements.forEach(element => {
  element.addEventListener('input', () => {
    isChanged = checkForChanges();
  });
  element.addEventListener('change', () => {
    isChanged = checkForChanges();
  });
});

fileInput.addEventListener('change', () => {
  isChanged = checkForChanges();
});
urlInput.addEventListener('input', () => {
  isChanged = checkForChanges();
});


createBtn.addEventListener('click', () => {
  // הצגה מיידית
  sidebarLeft.style.pointerEvents = 'none';
  overlay.style.display = 'flex';
  createModal.style.display = 'block';

  // דיליי קצר כדי לאפשר ל-CSS לעשות טרנזישן
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
    createModal.classList.add('visible');
    if (sidebarLeft) {
      sidebarLeft.classList.add('dimmed');
      sidebarLeft.classList.add('dimmed-overlay');
    }
    if (scrollBtn) scrollBtn.classList.add('dimmed');
  });
});

createModal.querySelector('#close-create-modal').addEventListener('click', () => {
  if (isChanged) {
    document.getElementById('confirmationModal').style.display = 'block';
    // document.getElementById('confirmation-overlay').style.display = 'block';
  } else {
    closeModal();
  }
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay && isChanged) {
    document.getElementById('confirmationModal').style.display = 'block';
    // document.getElementById('confirmation-overlay').style.display = 'block';
  } else if (e.target === overlay && !isChanged) {
    closeModal();
  }
});

// ניהול הודעת האישור
document.getElementById('discardBtn').addEventListener('click', () => {
  closeModal();
  document.getElementById('confirmationModal').style.display = 'none';
  // document.getElementById('confirmation-overlay').style.display = 'none';
  formElements.forEach(element => {
    if (element.type === 'checkbox') element.checked = originalValues[element.id];
    else element.value = originalValues[element.id];
  });
  previewImg.style.display = 'none';
  fileInput.value = '';
  urlInput.value = '';
  isChanged = false;
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  document.getElementById('confirmationModal').style.display = 'none';
  // document.getElementById('confirmation-overlay').style.display = 'none';
});

createModal.querySelector('#close-image').addEventListener('click', () => {
  previewImg.style.display = 'none';
  createModal.querySelector('#upload-options').style.display = 'block';
  createModal.querySelector('#close-image').style.display = 'none';
  fileInput.value = '';
  urlInput.value = '';
  createModal.querySelector('#error-message').style.display = 'none';
  isChanged = checkForChanges();
});


// Location suggestions
const locationInput = createModal.querySelector('#location-input');
const locationSuggestions = createModal.querySelector('.location-suggestions');

const textInputs = [createModal.querySelector('#new-post-desc'), locationInput, createModal.querySelector('.accessibility-content .input-field')];
textInputs.forEach(input => {
  input.addEventListener('input', () => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    if (hebrewRegex.test(input.value)) {
      input.setAttribute('lang', 'he');
    } else {
      input.setAttribute('lang', 'en');
    }
  });
});

document.addEventListener('click', (e) => {
  if (!locationInput.contains(e.target) && !locationSuggestions.contains(e.target)) {
    locationSuggestions.style.display = 'none';
  }
  if (!createModal.contains(e.target)) {
    createEmojiPicker.style.display = 'none';
  }
});

// Toggle accessibility and advanced settings
const accessibilityToggle = createModal.querySelector('.toggle-accessibility');
const advancedToggle = createModal.querySelector('.toggle-advanced');
const accessibilityContent = createModal.querySelector('.accessibility-content');
const advancedContent = createModal.querySelector('.advanced-settings-content');
const accessibilityArrow = accessibilityToggle.querySelector('.arrow-down');
const advancedArrow = advancedToggle.querySelector('.arrow-down');

accessibilityToggle.addEventListener('click', () => {
  const isOpen = accessibilityContent.style.display === 'block';
  accessibilityContent.style.display = isOpen ? 'none' : 'block';
  accessibilityArrow.classList.toggle('rotated', !isOpen);
});

advancedToggle.addEventListener('click', () => {
  const isOpen = advancedContent.style.display === 'block';
  advancedContent.style.display = isOpen ? 'none' : 'block';
  advancedArrow.classList.toggle('rotated', !isOpen);
});

// Toggle emoji picker
createEmojiBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const isVisible = createEmojiPicker.style.display === 'block';
  createEmojiPicker.style.display = isVisible ? 'none' : 'block';
  if (!isVisible) {
    const rect = createEmojiBtn.getBoundingClientRect();
    createEmojiPicker.style.top = `${rect.bottom + window.scrollY + 5}px`;
    createEmojiPicker.style.left = `${rect.left + window.scrollX}px`;
  }
});

// Add emoji to textarea
const emojiItems = createModal.querySelectorAll('.emoji-item');
emojiItems.forEach(item => {
  item.addEventListener('click', () => {
    textArea.value += item.textContent;
    textArea.focus();
    createEmojiPicker.style.display = 'none';
    isChanged = checkForChanges();
  });
});

function isValidImageUrl(url) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url);
}

const urlErrorMsg = createModal.querySelector('#error-message');

createModal.querySelector('#submit-new-post').addEventListener('click', () => {
  const file = fileInput.files[0];
  const url = urlInput.value.trim();
  const text = createModal.querySelector('#new-post-desc').value.trim();
  const urlErrorMsg = createModal.querySelector('#error-message');

  // בדיקה שהתיאור לא ריק
  if (!text) {
    alert('Please write a description.');
    return;
  }

  // אם יש תמונה (קובץ או URL תקף), עיבוד התמונה
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      resizeImage(e.target.result, (resizedImage) => {
        addPost(resizedImage, text);
      });
    };
    reader.readAsDataURL(file);
  } else if (url) {
    if (!isValidImageUrl(url)) {
      urlErrorMsg.style.display = 'block';
      urlInput.focus();
      return;
    } else {
      urlErrorMsg.style.display = 'none';
      resizeImage(url, (resizedImage) => {
        addPost(resizedImage, text);
      });
    }
  } else {
    // אם אין תמונה, אבל יש תיאור - שתף רק עם התיאור
    addPost(null, text);
  }
});


let leftSidebarOffset = -3860;
let textPostsCount = 0; 
let imagePostsCount = 0; 
let videoPostsCount = 0; 
let commentData2 = {}; 

function resizeImage(src, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const targetSize = 600;
    canvas.width = targetSize;
    canvas.height = targetSize;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetSize, targetSize);

    const ratio = Math.min(targetSize / img.width, targetSize / img.height);
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    const xOffset = (targetSize - newWidth) / 2;
    const yOffset = (targetSize - newHeight) / 2;

    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
    callback(canvas.toDataURL('image/jpeg'));
  };
  img.onerror = function() {
    callback(src);
  };
  img.src = src;
}

function addPost(image, text) {
  let processedImage = image;
  const postsWrapper = document.querySelector('.posts-wrapper');
  const storiesContainer = document.querySelector('.stories-container');
  const customFilter = document.querySelector('.custom-filter');

  if (!postsWrapper) {
    console.error('Error: .posts-wrapper not found in DOM');
    return;
  }

  // ודא שה-.custom-filter נמצא בראש אם הוא לא קיים
  if (!customFilter) {
    const filterElement = document.createElement('div');
    filterElement.className = 'custom-filter';
    postsWrapper.insertBefore(filterElement, postsWrapper.firstChild);
  }

  // עיבוד תמונה אם קיימת
  if (image) {
    resizeImage(image, (resizedImage) => {
      processedImage = resizedImage;
      createAndSetupPost(processedImage);
    });
  } else {
    createAndSetupPost(null);
  }

  function createAndSetupPost(image) {
    const postId = `post-${Date.now()}`;
    const newPost = createPost({
      username: '_ron_lhayanie',
      avatar: 'https://cdn-icons-png.flaticon.com/512/12225/12225935.png',
      image: image,
      likes: 0,
      text: text,
      commentsCount: 0,
      time: 'Just now',
      date: new Date().toDateString(),
    });

    newPost.id = postId;
    // הכנס את הפוסט כראשון אחרי ה-.custom-filter
    postsWrapper.insertBefore(newPost, customFilter.nextSibling || postsWrapper.firstChild.nextSibling);

    // אירועי לייק
    const likeBtn = newPost.querySelector('.like');
    likeBtn.addEventListener('click', function() {
      const post = this.closest('.post-actions').nextElementSibling;
      const likesCountSpan = post.querySelector('.likes-count');
      let currentLikes = parseInt(likesCountSpan.textContent.replace(/,/g, '')) || 0;
      const isLiked = this.src.includes('2107845.png');
      if (!isLiked) {
        this.src = 'https://cdn-icons-png.flaticon.com/256/2107/2107845.png';
        this.classList.add('liked');
        likesCountSpan.textContent = (currentLikes + 1).toLocaleString() + ' likes';
      } else {
        this.src = 'https://cdn-icons-png.flaticon.com/256/130/130195.png';
        this.classList.remove('liked');
        likesCountSpan.textContent = Math.max(0, currentLikes - 1).toLocaleString() + ' likes';
      }
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 400);
    });

    // אירועי תגובות
    const commentBtn = newPost.querySelector('.comment');
    commentBtn.addEventListener('click', () => {
      const post = commentBtn.closest('.post');
      window.currentPostInModal = post;
      const modal = document.querySelector('.comment-modal');
      if (!modal) return;

      modal.querySelector('.modal-post-image').src = post.querySelector('.post-image img')?.src || '';
      const avatarSrc = post.querySelector('.user-avatar')?.src || '';
      modal.querySelectorAll('.modal-user-avatar').forEach(i => i.src = avatarSrc);
      const username = post.querySelector('.user-name')?.textContent || '';
      modal.querySelectorAll('.modal-username').forEach(u => u.textContent = username);
      const descriptionEl = post.querySelector('.post-text .full-text') || post.querySelector('.post-text .short-text');
      modal.querySelector('.modal-post-description').textContent = descriptionEl?.textContent || '';
      const postLikesEl = post.querySelector('.likes-count');
      const modalLikesEl = modal.querySelector('.modal-likes-count');
      modalLikesEl.textContent = postLikesEl ? postLikesEl.textContent : '0 likes';

      const modalLikeBtn = modal.querySelector('.modal-footer-static .like');
      const modalSaveBtn = modal.querySelector('.modal-footer-static .save');
      const feedLikeBtn = post.querySelector('.post-actions .like');
      const feedSaveBtn = post.querySelector('.post-actions .save');
      if (modalLikeBtn && feedLikeBtn) {
        const liked = feedLikeBtn.classList.contains('liked');
        modalLikeBtn.classList.toggle('liked', liked);
        modalLikeBtn.src = liked ? 'https://cdn-icons-png.flaticon.com/256/2107/2107845.png' : 'https://cdn-icons-png.flaticon.com/256/130/130195.png';
      }
      if (modalSaveBtn && feedSaveBtn) {
        const isSaved = feedSaveBtn.classList.contains('saved');
        modalSaveBtn.classList.toggle('saved', isSaved);
        modalSaveBtn.src = isSaved ? 'https://static.thenounproject.com/png/bookmark-icon-809340-512.png' : 'https://static.thenounproject.com/png/bookmark-icon-809338-512.png';
      }

      const postId = post.id;
      modal.setAttribute('data-post-id', postId);
      const commentsList = modal.querySelector('.comments-list');
      commentsList.querySelectorAll('.comment-item:not(.writing)').forEach(el => el.remove());
      const postComments = commentData[postId] || [];
      postComments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment-item';
        commentEl.innerHTML = `<img src="${comment.avatar}" alt="${comment.username}" class="comment-avatar"><div class="comment-content"><span class="comment-username">${comment.username}</span><span class="comment-text" >${comment.text}</span></div>`;
        commentsList.appendChild(commentEl);
      });

      openCommentModal();
    });

    // אירועי שמירה
    const saveBtn = newPost.querySelector('.save');
    saveBtn.addEventListener('click', function() {
      const isSaved = this.classList.contains('saved');
      if (!isSaved) {
        this.classList.add('saved');
        this.src = 'https://static.thenounproject.com/png/bookmark-icon-809340-512.png';
      } else {
        this.classList.remove('saved');
        this.src = 'https://static.thenounproject.com/png/bookmark-icon-809338-512.png';
      }
    });

    // אירועי שיתוף
    const shareBtn = newPost.querySelector('.share');
    shareBtn.addEventListener('click', opensharemodal);

    // אירועי "more"
    const moreBtn = newPost.querySelector('.more');
    moreBtn.addEventListener('click', function() {
      const postText = this.closest('.post-text');
      const shortText = postText.querySelector('.short-text');
      const fullText = postText.querySelector('.full-text');
      if (fullText.style.display === 'none') {
        shortText.style.display = 'none';
        fullText.style.display = 'inline';
        this.textContent = 'less';
      } else {
        shortText.style.display = 'inline';
        fullText.style.display = 'none';
        this.textContent = 'more';
      }
    });

    // אירועי "more options" ומחיקה
    const moreOptionsBtn = newPost.querySelector('.more-options');
    const moreMenu = newPost.querySelector('.more-menu');
    const deleteIcon = newPost.querySelector('.delete-post-icon');

    moreOptionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block';
    });

    deleteIcon.addEventListener('click', () => {
      const postToDelete = deleteIcon.closest('.post');
      if (postToDelete) {
        postToDelete.remove();
        if (image) {
          imagePostsCount--;
          updateSidebarMargin(-670); // מעדכן מרג'ין כלפי מעלה עבור תמונה
        } else {
          textPostsCount--;
          updateSidebarMargin(-260); // מעדכן מרג'ין כלפי מעלה עבור טקסט
        }
        console.log('🗑️ פוסט נמחק, מספר פוסטי תמונות:', imagePostsCount, 'מספר פוסטי טקסט:', textPostsCount);
      }
    });

    // אירועי הוספת תגובה ישירות מהפוסט
    const addCommentBox = newPost.querySelector('.add-comment-box');
    const postButton = newPost.querySelector('.post-button');
    const viewCommentsText = newPost.querySelector('.view-comments-text');
    const commentsList = newPost.querySelector('.comments-list');
    const writingComment = document.createElement('div');
    writingComment.className = 'comment writing';
    writingComment.innerHTML = '<span class="comment-text">writing...</span>';

    addCommentBox.addEventListener('input', function() {
      postButton.classList.toggle('disabled', !this.value.trim());
      if (this.value.trim()) {
        if (!commentsList.querySelector('.writing')) {
          commentsList.appendChild(writingComment.cloneNode(true));
        }
      } else {
        const existingWriting = commentsList.querySelector('.writing');
        if (existingWriting) existingWriting.remove();
      }
    });

    postButton.addEventListener('click', function() {
      const commentText = addCommentBox.value.trim();
      if (commentText && !this.classList.contains('disabled')) {
        const postId = newPost.id;
        if (!commentData[postId]) commentData[postId] = [];
        const newComment = {
          avatar: 'https://cdn-icons-png.flaticon.com/512/12225/12225935.png',
          username: '_ron_lhayanie',
          text: commentText
        };
        commentData[postId].push(newComment);

        addCommentBox.value = '';
        postButton.classList.add('disabled');
        const existingWriting = commentsList.querySelector('.writing');
        if (existingWriting) existingWriting.remove();

        const totalComments = commentData[postId].length;
        viewCommentsText.textContent = `View all ${totalComments} comment${totalComments !== 1 ? 's' : ''}`;

        showToast(document.getElementById('toast-comment'));
      }
    });

    // פתיחת מודל תגובות דרך "View X Comments"
    viewCommentsText.addEventListener('click', function() {
      const post = this.closest('.post');
      window.currentPostInModal = post;
      const modal = document.querySelector('.comment-modal');
      if (!modal) return;

      modal.querySelector('.modal-post-image').src = post.querySelector('.post-image img')?.src || '';
      const avatarSrc = post.querySelector('.user-avatar')?.src || '';
      modal.querySelectorAll('.modal-user-avatar').forEach(i => i.src = avatarSrc);
      const username = post.querySelector('.user-name')?.textContent || '';
      modal.querySelectorAll('.modal-username').forEach(u => u.textContent = username);
      const descriptionEl = post.querySelector('.post-text .full-text') || post.querySelector('.post-text .short-text');
      modal.querySelector('.modal-post-description').textContent = descriptionEl?.textContent || '';
      const postLikesEl = post.querySelector('.likes-count');
      const modalLikesEl = modal.querySelector('.modal-likes-count');
      modalLikesEl.textContent = postLikesEl ? postLikesEl.textContent : '0 likes';

      const modalLikeBtn = modal.querySelector('.modal-footer-static .like');
      const modalSaveBtn = modal.querySelector('.modal-footer-static .save');
      const feedLikeBtn = post.querySelector('.post-actions .like');
      const feedSaveBtn = post.querySelector('.post-actions .save');
      if (modalLikeBtn && feedLikeBtn) {
        const liked = feedLikeBtn.classList.contains('liked');
        modalLikeBtn.classList.toggle('liked', liked);
        modalLikeBtn.src = liked ? 'https://cdn-icons-png.flaticon.com/256/2107/2107845.png' : 'https://cdn-icons-png.flaticon.com/256/130/130195.png';
      }
      if (modalSaveBtn && feedSaveBtn) {
        const isSaved = feedSaveBtn.classList.contains('saved');
        modalSaveBtn.classList.toggle('saved', isSaved);
        modalSaveBtn.src = isSaved ? 'https://static.thenounproject.com/png/bookmark-icon-809340-512.png' : 'https://static.thenounproject.com/png/bookmark-icon-809338-512.png';
      }

      const postId = post.id;
      modal.setAttribute('data-post-id', postId);
      const commentsList = modal.querySelector('.comments-list');
      commentsList.querySelectorAll('.comment-item:not(.writing)').forEach(el => el.remove());
      const postComments = commentData[postId] || [];
      postComments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment-item';
        commentEl.innerHTML = `<img src="${comment.avatar}" alt="${comment.username}" class="comment-avatar"><div class="comment-content"><span class="comment-username">${comment.username}</span><span class="comment-text">${comment.text}</span></div>`;
        commentsList.appendChild(commentEl);
      });

      openCommentModal();
    });

    // אירוע לפתיחת תפריט אימוג'ים
    const emojiBtn = newPost.querySelector('.emoji');
    const emojiPicker = document.getElementById('emoji-picker');
    let isPickerOpen = false;

    emojiBtn.addEventListener('click', () => {
      if (!isPickerOpen) {
        emojiPicker.style.display = 'block';
        emojiPicker.style.position = 'absolute';
        emojiPicker.style.padding = '10px';
        emojiPicker.style.maxWidth = '250px';
        emojiPicker.style.maxHeight = '150px';
        emojiPicker.style.overflow = 'auto';
        emojiPicker.style.zIndex = '1000';
        emojiPicker.style.width = '350px';
        emojiPicker.style.height = '350px';
        emojiPicker.style.top = '400px';
        emojiPicker.style.left = '950px';
        isPickerOpen = true;  

        document.body.classList.add('no-scroll');

        const emojiItems = emojiPicker.querySelectorAll('.emoji-item');
        emojiItems.forEach(item => {
          item.addEventListener('click', () => {
            addCommentBox.value += item.textContent;
            addCommentBox.dispatchEvent(new Event('input'));
            emojiPicker.style.display = 'none';
            isPickerOpen = false;
          });
        });

        document.addEventListener('click', outsideClickListener);
      } else {
        emojiPicker.style.display = 'none';
        isPickerOpen = false;
        document.removeEventListener('click', outsideClickListener);
      }
    });

    function outsideClickListener(event) {
      if (!emojiPicker.contains(event.target) && event.target !== emojiBtn) {
        emojiPicker.style.display = 'none';
        isPickerOpen = false;
        document.removeEventListener('click', outsideClickListener);
      }
    }

    // עדכון ספירת פוסטים ומרג'ין, ואיפוס המודל
    if (image) {
      imagePostsCount++;
      updateSidebarMargin(670); // מעדכן מרג'ין כלפי מטה עבור תמונה
    } else {
      textPostsCount++;
      updateSidebarMargin(260); // מעדכן מרג'ין כלפי מטה עבור טקסט
    }
    // איפוס המודל לאחר פרסום
    const imageInput = document.querySelector('#postImage'); // שדה התמונה
    if (imageInput) imageInput.value = ''; // איפוס שדה התמונה
    const textInput = document.querySelector('#postText'); // שדה התיאור
    if (textInput) textInput.value = ''; // איפוס שדה התיאור
    closeModal();
    showNotice();
    newPost.classList.add('highlight');
    setTimeout(() => newPost.classList.remove('highlight'), 2000);
  }
}

// פונקציה חיצונית לעדכון מרג'ין עם פרמטר מרחק
function updateSidebarMargin(distance) {
  const sidebarRight = document.querySelector('.sidebar-right');
  const newMargin = leftSidebarOffset - ((imagePostsCount * 670) + (textPostsCount * 260)); // חישוב מרג'ין לפי ספירות נפרדות
  sidebarRight.style.marginTop = `${newMargin}px`;
  console.log('🔧 עדכון מרג\'ין לסיידבאר השמאלי:', newMargin + 'px');
}

// פונקציות עזר
function updateCommentsCount(post) {
  const postId = post.id;
  const commentsCountSpan = post.querySelector('.comments-count') || post.querySelector('.view-comments-text');
  const count = (commentData2[postId] || []).length;
  if (commentsCountSpan) {
    commentsCountSpan.textContent = count > 0 ? `${count} comments` : '0 comments';
  }
}

function updateViewCommentsText(post) {
  const postId = post.id;
  const viewCommentsText = post.querySelector('.view-comments-text');
  const count = (commentData2[postId] || []).length;
  if (viewCommentsText) {
    viewCommentsText.textContent = `View all ${count} comment${count !== 1 ? 's' : ''}`;
  }
}

function showNotice() {
  if (!notice) return;
  notice.style.display = 'block';
  notice.style.animation = 'fadeSlideIn 0.4s ease-in forwards';

  setTimeout(() => {
    notice.style.animation = 'fadeSlideOut 0.4s ease-out forwards';
    setTimeout(() => {
      notice.style.display = 'none';
    }, 400);
  }, 2000);
}

function createPost({ username, avatar, image, likes, text, commentsCount, time, date }) {
  const post = document.createElement('div');

  const postType = image ? 'imgtype' : 'texttype';
  post.className = `post ${postType}`;

  const isLongText = text.length > 30;
  const shortText = text.substring(0, 30);

  post.innerHTML = `
    <div class="post-header">
      <div class="post-user">
        <div class="avatar-wrapper">
          <img src="${avatar}" alt="${username}" class="user-avatar">
        </div>
        <div class="user-details">
          <span class="user-name">${username}</span>
          <span class="dot">•</span>
          <span class="time" title="${date}">${time}</span>
        </div>
      </div>
      <button class="more-options">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#" viewBox="0 0 24 24">
          <circle cx="6" cy="12" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="18" cy="12" r="1.5"/>
        </svg>
      </button>
      <div class="more-menu" style="display: none;">
        <img class="delete-post-icon" src="https://img.icons8.com/?size=512&id=1942&format=png" alt="Delete">
      </div>
    </div>
    ${image ? `
      <div class="post-image">
        <img src="${image}" alt="Post Image">
      </div>` : ''}
    <div class="post-actions">
      <div class="left-actions">
        <img class="like" src="https://cdn-icons-png.flaticon.com/256/130/130195.png" alt="likebtn">
        <img class="comment" src="https://cdn-icons-png.flaticon.com/256/5948/5948565.png" alt="commentbtn">
        <img class="share" src="https://static.thenounproject.com/png/3084968-200.png" alt="sharebtn">
      </div>
      <img class="save" src="https://static.thenounproject.com/png/bookmark-icon-809338-512.png" alt="savebtn">
    </div>
    <div class="post-description">
      <div class="likes-row">
        <span class="likes-count">${likes} likes</span>
      </div>
      <p class="post-text">
        <span class="user-name">${username}</span>
        <span class="short-text">${text.substring(0, 30)}...</span>
        <span class="full-text" style="display:none;">${text}</span>
        <span class="more">more</span>
      </p>
      <div class="comment-section">
        <p class="view-comments"><span class="view-comments-text">View all ${commentsCount} comments</span></p>
        <div class="comments-list"></div>
        <div class="comment-row">
          <textarea class="add-comment-box" placeholder="Add a comment..."></textarea>
          <span class="post-button">Post</span>
          <svg aria-label="Emoji" class="emoji" fill="currentColor" height="13" role="img" viewBox="0 0 24 24" width="13">
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"/>
          </svg>
        </div>
      </div>
    </div>
  `;
  return post;
}

function filterPostsByType(type) {
  const allPosts = document.querySelectorAll('.post');

  allPosts.forEach(post => {
    post.style.display = 'none';
    
    const isText = post.classList.contains('texttype');
    const isImage = post.classList.contains('imgtype');
    const isVideo = post.classList.contains('videotype');

    if (
      type === 'all' ||
      (type === 'text' && isText) ||
      (type === 'image' && isImage) ||
      (type === 'video' && isVideo)
    ) {
      post.style.display = '';
    }
  });
}

function updateRightSidebarClass(currentType) {
  const rsidebar = document.getElementById('sidebarRight');

  // בדיקה אם הסיידבאר קיים
  if (!rsidebar) {
    console.error('🚫 הסיידבאר לא נמצא ב-DOM');
    return;
  }

  // הסרת כל הקלאסים הקשורים להצגה והסתרה
  rsidebar.classList.remove('hide-0', 'hide-1', 'hide-2', 'hide-3plus');
  rsidebar.classList.remove('show-text', 'show-image', 'show-video', 'show-all');
  rsidebar.style.marginTop = ''; // איפוס המרג'ין

  // הוספת הקלאס המתאים לפי סוג הפוסט
  switch (currentType) {
    case 'text':
      rsidebar.classList.add('show-text');
      break;
    case 'image':
      rsidebar.classList.add('show-image');
      break;
    case 'video':
      rsidebar.classList.add('show-video');
      break;
    case 'all':
    default:
      rsidebar.classList.add('show-all');
      break;
  }

  // עדכון המרג'ין
    const baseMargin = parseInt(window.getComputedStyle(rsidebar).marginTop) || 0; // ערך ברירת מחדל
    let adjustedMargin;


  if (currentType === 'all') {
    // הדפסת קאונטרים לבדיקה
    console.log('📌 קאונטרים לפני חישוב all:', {
      imagePostsCount: imagePostsCount || 0,
      textPostsCount: textPostsCount || 0,
      videoPostsCount: videoPostsCount || 0
    });

    // חישוב ההפחתה עבור 'all': תמונות * 670 + טקסט * 260 + וידאו * 670
    const offset = (
      ((imagePostsCount || 0) * 670) +
      ((textPostsCount || 0) * 260) +
      ((videoPostsCount || 0) * 670)
    );
    adjustedMargin = baseMargin - offset; // שימוש ב-baseMargin כדי לשמור על מרג'ין דינמי
    rsidebar.style.marginTop = `${adjustedMargin}px`;
    console.log(`📊 עדכון מרג'ין עבור ${currentType}: ${adjustedMargin}px (תמונות: ${imagePostsCount || 0}, טקסט: ${textPostsCount || 0}, וידאו: ${videoPostsCount || 0}, הפחתה: ${offset}px)`);
  } else {
      // חישוב המרג'ין לפי סוג הפוסט
      let postCount = 0;
      let offset = 0;
      if (currentType === 'text') {
        postCount = textPostsCount;
        offset = 260;
      } else if (currentType === 'image') {
        postCount = imagePostsCount;
        offset = 670;
      } else if (currentType === 'video') {
        postCount = videoPostsCount;
        offset = 670;
      }

      if (postCount > 0) {
        adjustedMargin = baseMargin - (postCount * offset);
        rsidebar.style.marginTop = `${adjustedMargin}px`;
        console.log(`📉 הפחתת מרג'ין עבור ${postCount} פוסטים מסוג ${currentType}: ${adjustedMargin}px`);
      }
    }
}

const filterIcon = document.querySelector('.filter-icon');
const dropdown = document.querySelector('.dropdown');

filterIcon.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
  if (!document.querySelector('.custom-filter').contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

const dropdownOptions = document.querySelectorAll('.dropdown-option');

dropdownOptions.forEach(option => {
  option.addEventListener('click', () => {
    const type = option.dataset.type;
    console.log("📌 סינון לפי:", type);
    dropdown.style.display = 'none';

    filterPostsByType(type);
    updateRightSidebarClass(type);
  });
});

document.addEventListener('click', function (e) {
  if (e.target.closest('.more-options')) {
    const post = e.target.closest('.post');
    const menu = post.querySelector('.more-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  } else {
    document.querySelectorAll('.more-menu').forEach(menu => {
      menu.style.display = 'none';
    });
  }

  if (e.target.classList.contains('delete-post-icon')) {
    const post = e.target.closest('.post');
    post.remove();
    console.log('🗑️ פוסט נמחק');
  }
});

function moveCustomFilterToPost(post) {
  const customFilter = document.querySelector('.custom-filter');
  if (!customFilter) return;

  customFilter.remove();

  const header = post.querySelector('.post-header');
  const moreBtn = header.querySelector('.more-options');
  header.insertBefore(customFilter, moreBtn);
}

function filterPosts(type) {
  const allPosts = document.querySelectorAll('.posts-wrapper .post');
  let firstVisiblePost = null;

  allPosts.forEach(post => {
    const isImage = post.classList.contains('imgtype');
    const isText = post.classList.contains('texttype');
    const isVideo = post.classList.contains('videotype');

    let show = false;
    if (type === 'all') show = true;
    else if (type === 'image') show = isImage;
    else if (type === 'text') show = isText;
    else if (type === 'video') show = isVideo;

    post.style.display = show ? 'block' : 'none';

    if (show && !firstVisiblePost) {
      firstVisiblePost = post;
    }
  });

  if (firstVisiblePost) {
    moveCustomFilterToPost(firstVisiblePost);
  }
}