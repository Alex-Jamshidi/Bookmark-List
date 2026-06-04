// Import Jest functions
import { describe, it, expect, beforeEach } from "@jest/globals";

// Import readFileSync from Node.js built-in file system module
// Allows import of index.HTML for tests
import { readFileSync } from "fs";

// Import JSDOM — a library that simulates a browser DOM in Node.js
import { JSDOM } from "jsdom";

// ======================================================
// ----- Setup DOM
// ======================================================

// Reads index.html file from disk as a string
const html = readFileSync("./index.html", "utf-8");

// Passes HTML string into JSDOM to create a fake browser environment
const dom = new JSDOM(html, { url: "http://localhost" });

// Make fake document and localStorage available globally (so script.js can use them)
global.document = dom.window.document;
global.window = dom.window;
global.localStorage = dom.window.localStorage;

// Import storage functions
const { getUserIds, getData, setData, clearData } =
  await import("./storage.js");

// ======================================================
// ----- Seed Data and Setup
// ======================================================

function resetData() {
  getUserIds().forEach(clearData);
  setData("1", [
    {
      title: "Google",
      description: "Search engine",
      url: "https://www.google.com/",
      timeStamp: "Bookmark created first",
      likes: 0,
    },
    {
      title: "CYF",
      description: "Learn code",
      url: "https://www.codeyourfuture.io/",
      timeStamp: "Bookmark created second",
      likes: 0,
    },
  ]);

  setData("2", [
    {
      title: "GitHub",
      description: "Version control",
      url: "https://www.github.com/",
      timeStamp: "Bookmark created first",
      likes: 0,
    },
  ]);
}

// This ensures every single test runs in a completely clean environment
// Seed data is added and User 1 is selected
beforeEach(() => {
  // Reset backend (bookmark data to seed data)
  resetData();

  // Reset frontend (clear bookmarks container)
  document.getElementById("bookmarks-container").innerHTML = "";

  // Selects User 1
  const userSelect = document.getElementById("user-select");
  if (userSelect) {
    userSelect.value = "1";
    userSelect.dispatchEvent(new dom.window.Event("change"));
  }
});

// ======================================================
// ----- Tests
// ======================================================
const { displayBookmarks, addBookmark, deleteBookmark, addLike } =
  await import("./script.js");

describe("The website must contain a drop-down which lists five users", () => {
  it("user select drop-down has 5 users", () => {
    const userSelect = document.getElementById("user-select");
    const userCount = userSelect.options.length - 1;
    expect(userCount).toEqual(5);
  });

  it("storage contains 5 users", () => {
    expect(getUserIds().length).toEqual(5);
  });
});

describe("Selecting a user must display the list of bookmarks for the relevant user", () => {
  it("displays 2 bookmarks for user 1", () => {
    displayBookmarks(getData("1"));
    const titles = document.querySelectorAll(".bookmark-title");
    expect(titles.length).toBe(2);
  });

  it("switching users clears previous bookmarks", () => {
    displayBookmarks(getData("1"));
    displayBookmarks(getData("2"));

    const titles = document.querySelectorAll(".bookmark-title");

    expect(titles.length).toBe(1);
    expect(titles[0].textContent).toBe("GitHub");
  });
});

describe("If there are no bookmarks for the selected user, a message is displayed to explain this", () => {
  it("user 3 returns no bookmarks message", () => {
    const bookmarksContainer = document.getElementById("bookmarks-container");
    displayBookmarks(getData("3"));
    expect(
      bookmarksContainer.querySelector(".no-bookmarks-msg").textContent,
    ).toBe("This user doesn't have any saved bookmarks yet.");
  });
});

describe("The list of bookmarks must be shown in reverse chronological order", () => {
  it("displays 2 bookmarks for user 1 in reverse order of storage", () => {
    displayBookmarks(getData("1"));
    const timestamps = document.querySelectorAll(".bookmark-timestamp");
    expect(timestamps[0].textContent).toBe("Bookmark created second");
    expect(timestamps[1].textContent).toBe("Bookmark created first");
  });
});

describe("Each bookmark has a title, description and created at timestamp displayed", () => {
  it("displays title, description and timestamp for each bookmark", () => {
    displayBookmarks(getData("1"));

    const titles = document.querySelectorAll(".bookmark-title");
    const descriptions = document.querySelectorAll(".bookmark-description");
    const timestamps = document.querySelectorAll(".bookmark-timestamp");

    expect(titles[0].textContent).toBe("CYF");
    expect(descriptions[0].textContent).toBe("Learn code");
    expect(timestamps[0].textContent).toBe("Bookmark created second");

    expect(titles[1].textContent).toBe("Google");
    expect(descriptions[1].textContent).toBe("Search engine");
    expect(timestamps[1].textContent).toBe("Bookmark created first");
  });
});

describe("Each bookmark's title is a link to the bookmark's URL", () => {
  it("each bookmark title is an anchor tag linking to the correct URL", () => {
    displayBookmarks(getData("1"));

    const titles = document.querySelectorAll(".bookmark-title");

    expect(titles[0].tagName).toBe("A");
    expect(titles[0].href).toBe("https://www.codeyourfuture.io/");

    expect(titles[1].tagName).toBe("A");
    expect(titles[1].href).toBe("https://www.google.com/");
  });
});

describe("Adding a like is performed correctly by backend function", () => {
  it("should directly increment the likes property of a specific bookmark in storage", () => {
    expect(getData("1")[1].likes).toBe(0);
    addLike("1", 1);
    expect(getData("1")[1].likes).toBe(1);

    // Check likes on other bookmark is untouched
    expect(getData("1")[0].likes).toBe(0);
  });
});

describe("Each bookmark's like counter works independently, and persists data across sessions", () => {
  it("clicking like on one bookmark only increments that bookmark's count", () => {
    displayBookmarks(getData("1"));

    const likeBtns = document.querySelectorAll(".like-btn");
    likeBtns[0].click();

    const likeCounts = document.querySelectorAll(".like-count");
    expect(likeCounts[0].textContent).toBe("1");
    expect(likeCounts[1].textContent).toBe("0");
  });

  it("like count persists in storage after clicking", () => {
    displayBookmarks(getData("1"));

    const likeBtns = document.querySelectorAll(".like-btn");
    likeBtns[0].click();

    const stored = getData("1");
    expect(stored[1].likes).toBe(1);
  });
});

describe("Adding a bookmark is performed correctly by backend function", () => {
  it("should directly append a new bookmark object into the user's storage array", () => {
    expect(getData("2").length).toBe(1);

    addBookmark(
      "2",
      "https://www.wikipedia.org/",
      "Wikipedia",
      "Encyclopedia",
      "now",
    );

    const updatedData = getData("2");

    expect(updatedData.length).toBe(2);
    expect(updatedData[1].title).toBe("Wikipedia");
    expect(updatedData[1].likes).toBe(0);
    expect(updatedData[1].timeStamp).toBe("Bookmark created now");
  });
});

describe("Deleting a bookmark is performed correctly by backend function", () => {
  it("should remove the bookmark at the specified index from storage", () => {
    const initialData = getData("1");
    expect(initialData.length).toBe(2);
    expect(initialData[0].title).toBe("Google");

    deleteBookmark("1", 0);

    const updatedData = getData("1");
    expect(updatedData.length).toBe(1);
    expect(updatedData[0].title).toBe("CYF");
  });
});
