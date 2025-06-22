

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
  const modal = document.querySelector('.comment-modal');
  modal.style.display = 'flex';
    setTimeout(() => {
    modal.classList.add('active');
  }, 10);

  const sidebar = document.querySelector('.sidebar-left');
  const scrollBtn = document.querySelector('#scrollToTopBtn');
  if (sidebar) sidebar.classList.add('disable-interactions');
  if (scrollBtn) scrollBtn.classList.add('disable-interactions');
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
  if (sidebar) sidebar.classList.remove('disable-interactions');
  if (scrollBtn) scrollBtn.classList.remove('disable-interactions');
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
  });



});

