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
const users = getUserIds();
let currentUserId;

function setup() {
  userSelect.value = "";
  createDummyBookmarks(users);
  render();
}

function render() {
  if (!users.includes(currentUserId)) return;
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
  const noBookmarksMessage = document
    .getElementById("no-bookmarks-template")
    .content.cloneNode(true);

  if (!allBookmarks || allBookmarks.length === 0) {
    bookmarksContainer.replaceChildren(noBookmarksMessage);
    return;
  }

  const bookmarks = allBookmarks
    .map((bookmark, index) => createBookmark(bookmark, index))
    .toReversed();
  bookmarksContainer.replaceChildren(...bookmarks);
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

export function addBookmark(
  userId,
  urlInput,
  titleInput,
  descInput,
  timeInput,
) {
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

export function addLike(userId, index) {
  const currentBookmarks = getData(userId);
  currentBookmarks[index].likes = (currentBookmarks[index].likes || 0) + 1;
  setData(userId, currentBookmarks);
}

export function deleteBookmark(userId, index) {
  const currentBookmarks = getData(userId);
  currentBookmarks.splice(index, 1);
  setData(userId, currentBookmarks);
}

// ======================================================
// ----- Functions for testing
// ======================================================

// populate each user with 2 bookmarks
function createDummyBookmarks(users) {
  for (const userId of users) {
    if (!localStorage.getItem(`stored-data-user-${userId}`)) {
      setData(userId, [
        {
          title: "Another Dummy Bookmark",
          description:
            "I'm another pre-made bookmark, why not try to delete me?",
          url: "https://www.google.com/search?q=please+don't+delete+me",
          timeStamp: "Bookmark created an hour before time began",
          likes: 0,
        },
        {
          title: "Dummy Bookmark to get you started",
          description:
            "I'm a pre-made bookmark to use as an example, why not try to click me or copy my URL?",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          timeStamp: "Bookmark created before time began",
          likes: 0,
        },
      ]);
    }
  }
}

// users.forEach(clearData); // uncomment me to reset bookmarks

// ======================================================
// ----- Page Loader
// ======================================================
window.onload = setup;
