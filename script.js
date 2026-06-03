import { getUserIds, setData, getData, clearData } from "./storage.js";

// ======================================================
// ----- DOMS
// ======================================================
const userSelect = document.getElementById("user-select");
const bookmarksContainer = document.getElementById("bookmarks-container");
const bookmarkForm = document.getElementById("bookmark-form");

// ======================================================
// ----- Setup and Render
// ======================================================
let currentUserId;

function setup() {
  userSelect.value = "";
  const users = getUserIds();
  // clearAllData(); // testing only
  createBookmarksData(users); // testing only
  render();
}

function render() {
  displayBookmarks(getData(currentUserId));
}

// ======================================================
// ----- Front End
// ======================================================

// checks for change of user
userSelect.addEventListener("change", function (option) {
  currentUserId = userSelect.value;
  render();
});

// Creates and displays bookmarks for single user in reverse chronological order.
export function displayBookmarks(allBookmarks) {
  bookmarksContainer.innerHTML = "";
  const bookmarks = allBookmarks
    .map((bookmark, index) => ({ bookmark, index }))
    .toReversed()
    .map(({ bookmark, index }) => createBookmark(bookmark, index));
  bookmarksContainer.append(...bookmarks);
}

// Creates single bookmark
function createBookmark(bookmark, index) {
  const template = document.getElementById("bookmark-template");
  const clone = template.content.cloneNode(true);

  const titleLink = clone.querySelector(".bookmark-title");
  titleLink.textContent = bookmark.title;
  titleLink.href = bookmark.url;

  clone.querySelector(".bookmark-description").textContent =
    bookmark.description;
  clone.querySelector(".bookmark-timestamp").textContent = bookmark.timeStamp;
  clone.querySelector(".like-count").textContent = bookmark.likes || 0;

  const likeBtn = clone.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    addLike(currentUserId, index);
    render();
  });

  const deleteBtn = clone.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    deleteBookmark(currentUserId, index);
    render();
  });

  const copyBtn = clone.querySelector(".copy-btn");
  copyBtn.addEventListener("click", () => {
    if (bookmark.url) {
      navigator.clipboard.writeText(bookmark.url);
    }
  });

  return clone;
}

// submit button
bookmarkForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!currentUserId) {
    alert("Please select a user first before adding a bookmark.");
    return;
  }

  const urlInput = document.getElementById("bookmark-url");
  const titleInput = document.getElementById("bookmark-title");
  const descInput = document.getElementById("bookmark-desc");
  const timeStamp = new Date().toLocaleString();

  addBookmark(
    currentUserId,
    urlInput.value,
    titleInput.value,
    descInput.value,
    timeStamp,
  );

  render();
  bookmarkForm.reset();
});

// ======================================================
// ----- Back End
// ======================================================

function addBookmark(userId, urlInput, titleInput, descInput, timeInput) {
  const newBookmark = {
    title: titleInput,
    description: descInput,
    url: urlInput,
    likes: 0,
    timeStamp: `Bookmark created ${timeInput}`,
  };

  const currentBookmarks = getData(userId) || [];
  currentBookmarks.push(newBookmark);
  setData(userId, currentBookmarks);
}

function addLike(userId, index) {
  const currentBookmarks = getData(userId);
  currentBookmarks[index].likes = (currentBookmarks[index].likes || 0) + 1;
  setData(userId, currentBookmarks);
}

function deleteBookmark(userId, index) {
  const currentBookmarks = getData(userId);
  currentBookmarks.splice(index, 1);
  setData(userId, currentBookmarks);
}

// ======================================================
// ----- Functions for testing
// ======================================================

// populate each user with 2 bookmarks
function createBookmarksData(users) {
  for (const userId of users) {
    if (!localStorage.getItem(`stored-data-user-${userId}`)) {
      setData(userId, [
        {
          title: `User-${userId}'s  1st bookmark title`,
          description: `I am the 1st bookmark of user-${userId}`,
          url: `https://www.google.com/search?q=user${userId}+bookmark1`,
          timeStamp: "Bookmark created 03/06/2026, 12:00:00",
          likes: 0,
        },
        {
          title: `User-${userId}'s  2nd bookmark title`,
          description: `I am the 2nd bookmark of user-${userId}`,
          url: `https://www.google.com/search?q=user${userId}+bookmark2`,
          timeStamp: "Bookmark created 03/06/2026, 17:30:00",
          likes: 0,
        },
      ]);
    }
  }
}

function clearAllData() {
  const users = getUserIds();
  for (const userId of users) {
    clearData(userId);
  }
}

// ======================================================
// ----- Page Loader
// ======================================================
window.onload = setup;
