import { getUserIds, setData, getData } from "./storage.js";

// ======================================================
// ----- DOMS
// ======================================================
const userSelect = document.getElementById("user-select");
const bookmarksContainer = document.getElementById("bookmarks-container");
const bookmarkForm = document.getElementById("bookmark-form");
// ======================================================
// ----- Runs on page load
// ======================================================
function setup() {
  const users = getUserIds();
  createBookmarksData(users); // testing only
}

// ======================================================
// ----- Bookmarks
// ======================================================

// Creates and displays bookmarks for single user
function displayBookmarks(allBookmarks) {
  bookmarksContainer.innerHTML = "";
  const bookmarks = allBookmarks.map((bookmark, index) => createBookmark(bookmark, index));
  bookmarksContainer.append(...bookmarks);
}

// Creates single bookmark
function createBookmark(bookmark, index) {
  const template = document.getElementById("bookmark-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".bookmark-title").textContent = bookmark.title;
  clone.querySelector(".bookmark-description").textContent = bookmark.description;
  
  const likeCountSpan = clone.querySelector(".like-count");
  likeCountSpan.textContent = bookmark.likes || 0;

  const likeBtn = clone.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    const userID = userSelect.value;
    const currentBookmarks = getData(userID);
    
    currentBookmarks[index].likes = (currentBookmarks[index].likes || 0) + 1;
    
    setData(userID, currentBookmarks);
    displayBookmarks(currentBookmarks);
  });

  const deleteBtn = clone.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    const userID = userSelect.value;
    const currentBookmarks = getData(userID);
    
    currentBookmarks.splice(index, 1);
    
    setData(userID, currentBookmarks);
    displayBookmarks(currentBookmarks);
  });

  return clone;
}

// ======================================================
// ----- User select
// ======================================================

// Gets user's bookmarks
userSelect.addEventListener("change", function (option) {
  const userID = option.target.value;
  displayBookmarks(getData(userID));
});

// ======================================================
// ----- Functions for testing
// ======================================================

// populate each user with 2 bookmarks
function createBookmarksData(users) {
  for (const userID of users) {
    if (!localStorage.getItem(`stored-data-user-${userID}`)) {
      setData(userID, [
        {
          title: `User-${userID}'s  1st bookmark title`,
          description: `I am bookmark 1st of user-${userID}`,
          likes: 0,
        },
        {
          title: `User-${userID}'s  2nd bookmark title`,
          description: `I am bookmark 2nd of user-${userID}`,
          likes: 0,
        },
      ]);
    }
  }
}

bookmarkForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const userID = userSelect.value;

  if (!userID) {
    alert("Please select a user first before adding a bookmark.");
    return;
  }

  const urlInput = document.getElementById("bookmark-url");
  const titleInput = document.getElementById("bookmark-title");
  const descInput = document.getElementById("bookmark-desc");

  const newBookmark = {
    title: titleInput.value,
    description: descInput.value,
    likes: 0,
  };

  const currentBookmarks = getData(userID) || [];
  currentBookmarks.push(newBookmark);

  setData(userID, currentBookmarks);
  displayBookmarks(currentBookmarks);

  bookmarkForm.reset();
});
// ======================================================
// ----- Page Loader
// ======================================================
window.onload = setup;
