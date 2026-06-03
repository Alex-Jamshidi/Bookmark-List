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
// ----- Seed Data
// ======================================================
setData("1", [
  { title: "Google", description: "Search engine" },
  { title: "CYF", description: "Learn code" },
]);

setData("2", [{ title: "GitHub", description: "Version control" }]);

// ======================================================
// ----- Tests
// ======================================================
const { displayBookmarks } = await import("./script.js");

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
  // Runs before every test — clears the bookmarks container
  beforeEach(() => {
    console.log("container:", document.getElementById("bookmarks-container"));
    console.log("document body:", document.body.innerHTML);
    document.getElementById("bookmarks-container").innerHTML = "";
  });

  it("displays 2 bookmarks for user 1", () => {
    displayBookmarks(getData("1"));

    const titles = document.querySelectorAll(".bookmark-title");

    expect(titles.length).toBe(2);
    expect(titles[0].textContent).toBe("Google");
    expect(titles[1].textContent).toBe("CYF");
  });

  it("switching users clears previous bookmarks", () => {
    displayBookmarks(getData("1"));
    displayBookmarks(getData("2"));

    const titles = document.querySelectorAll(".bookmark-title");

    expect(titles.length).toBe(1);
    expect(titles[0].textContent).toBe("GitHub");
  });
});
