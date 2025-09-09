const fetch = require("node-fetch"); // עובד ב־node-fetch@2 בלבד

const pageId = "818241574699048"; // שים את ה־Page ID שלך
const pageAccessToken = "EAATEToGZAuO4BPdBncxf2F4lFYBsxZCSd04Mx6d6cvDtivFP0gFtB02jaXXhqeFVA31815x1Mr0851SFya4vjaE0Nuv5o4cvBlhfAL9uumBcy49QmIZBz4FgS2HR2CpmG3nqlngnbd6U0ZBPL1VPXc2oLchHS6uuj4IokPwpTldPZAaHCbaJ3lnZARLZBZC3KVpcXReQkXMJiQRCwHRztbZAfExZBUNNh2Ffe2IxEiUZCSXzmEZD";

// פונקציה לעמעם טוקן בלוגים
function maskToken(t) {
  if (!t) return 'MISSING';
  return t.slice(0, 6) + '…' + t.slice(-6);
}

/**
 * פרסום פוסט בפייסבוק
 * @param {string} message - הטקסט של הפוסט
 * @param {string} userName - השם של המשתמש שפרסם
 */
async function postToFacebookPage(message, userName) {
  const url = `https://graph.facebook.com/${pageId}/feed`;
  const params = new URLSearchParams({
    message: `${message}\n\n- Posted by ${userName}`,
    access_token: pageAccessToken
  });

  console.log('[FB] POST ->', url, ' token:', maskToken(pageAccessToken));

  try {
    const response = await fetch(url, { method: "POST", body: params });
    const data = await response.json();

    console.log('[FB] POST response:', data);

    if (data.error) {
      console.error("Facebook API error (post):", data.error);
      throw new Error(data.error.message);
    }
    return data; // { id: "PAGEID_POSTID" }
  } catch (err) {
    console.error("Failed to post to Facebook:", err);
    throw err;
  }
}

/**
 * מחיקת פוסט מפייסבוק לפי ה־facebookPostId שהוחזר ביצירה
 * @param {string} facebookPostId - ה־ID המלא של הפוסט (PAGEID_POSTID)
 */
async function deleteFacebookPost(facebookPostId) {
  if (!facebookPostId) throw new Error('facebookPostId required');

  const url = `https://graph.facebook.com/${facebookPostId}`;
  console.log('[FB] DELETE ->', url, ' token:', maskToken(pageAccessToken));

  try {
    const res = await fetch(`${url}?access_token=${pageAccessToken}`, { method: 'DELETE' });
    const data = await res.json();

    console.log('[FB] DELETE response:', data);

    if (data.error) {
      console.error("Facebook API error (delete):", data.error);
      throw new Error(data.error.message);
    }
    return data; // צפוי { success: true }
  } catch (err) {
    console.error("Failed to delete Facebook post:", err);
    throw err;
  }
}

module.exports = { postToFacebookPage, deleteFacebookPost };
