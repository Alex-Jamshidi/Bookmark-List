import { getUserIds, setData, getData } from "./storage.js";

// ======================================================
// ----- DOMS
// ======================================================
const userSelect = document.getElementById("user-select");
const bookmarksContainer = document.getElementById("bookmarks-container");

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
  const bookmarks = allBookmarks.map(createBookmark);
  bookmarksContainer.append(...bookmarks);
}

// Creates single bookmark
function createBookmark(bookmark) {
  const template = document.getElementById("bookmark-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".bookmark-title").textContent = bookmark.title;
  clone.querySelector(".bookmark-description").textContent =
    bookmark.description;

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
  for (const userID of users)
    setData(userID, [
      {
        title: `User${userID}'s bookmark1 title`,
        description: `I am bookmark 1 of user${userID}`,
      },
      {
        title: `User${userID}'s bookmark2 title`,
        description: `I am bookmark 2 of user${userID}`,
      },
    ]);
}

// ======================================================
// ----- Page Loader
// ======================================================
window.onload = setup;
