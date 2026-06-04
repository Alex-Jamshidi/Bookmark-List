# The following criteria were tested through:
* Unit tests in script.test.js

* The website must contain a drop-down which lists five users
* Selecting a user must display the list of bookmarks for the relevant user
* If there are no bookmarks for the selected user, a message is displayed to explain this
* The list of bookmarks must be shown in reverse chronological order
* Each bookmark has a title, description and created at timestamp displayed
* Each bookmark’s title is a link to the bookmark’s URL
* Each bookmark’s like counter works independently, and persists data across sessions

# The following criteria were tested through:
* Manual testing on live site
**Live Site:** [https://bookmark-list-fayaz-alex.netlify.app/](https://bookmark-list-fayaz-alex.netlify.app/)

* The website must contain a form with inputs for a URL, a title, and a description. The form should have a submit button.
* Submitting the form adds a new bookmark for the relevant user only
* After creating a new bookmark, the list of bookmarks for the current user is shown, including the new bookmark
* Each bookmark’s “Copy to clipboard” button must copy the URL of the bookmark

### How this was done:
* 1. Load site, check form, input new bookmark (URL, title and description), click submit.
* 2. New bookmark was added to list of bookmarks and shown below for the relevant user.
* 3. Switching user does not show the added bookmark.
* 4. Switching back to original user and clicking copy URL copies correct url into clipboard.

# The website must score 100 for accessibility in Lighthouse
Checked through Chrome:
<img width="2454" height="1270" alt="image" src="https://github.com/user-attachments/assets/00a315fe-b1c9-4b43-862a-c7455a163736" />



# Unit tests must be written for at least one non-trivial function
Complete
