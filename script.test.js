// Imported Jest functions
import { describe, it, expect, beforeEach } from "@jest/globals";

// Import readFileSync from Node.js built-in file system module
// Allows import of index.HTML for tests
import { readFileSync } from "fs";

// Import JSDOM — a library that simulates a browser DOM in Node.js
import { JSDOM } from "jsdom";

// ======================================================
// ----- Setup
// ======================================================

// Reads index.html file from disk as a string
const html = readFileSync("./index.html", "utf-8");

// Passes HTML string into JSDOM to create a fake browser environment
const dom = new JSDOM(html);

// Make fake document and localStorage available globally (so script.js can use them)
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

// Import storage functions
import { getUserIds, getData, setData, clearData } from "./storage.js";

// ======================================================
// ----- Seed Data
// ======================================================
import { displayBookmarks } from "./script.js";

createBookmarksData(getUserIds);

// ======================================================
// ----- Tests
// ======================================================
