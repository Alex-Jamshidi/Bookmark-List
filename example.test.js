import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

// test("dropdown should have 5 users", () => {
//   const select = document.getElementById("user-select");
//   expect(select.options.value).toEqual("Alex Jamshidi");
// });
