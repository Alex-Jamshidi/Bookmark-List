import { getUserIds } from "./storage.js";

window.onload = function () {
  const users = getUserIds();
  document.querySelector("body").innerText = `There are ${users.length} users`;
};

// DOMS
const userSelect = document.getElementById("user-select");
const userSelect = document.getElementById("bookmarks-container");

