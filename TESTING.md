# The following criteria were tested through Unit tests in script.test.js

The website must contain a drop-down which lists five users
Selecting a user must display the list of bookmarks for the relevant user
If there are no bookmarks for the selected user, a message is displayed to explain this
The list of bookmarks must be shown in reverse chronological order
Each bookmark has a title, description and created at timestamp displayed
Each bookmark’s title is a link to the bookmark’s URL
Each bookmark’s like counter works independently, and persists data across sessions

# The following criteria were tested through manual testing on live site:

https://bookmark-list-fayaz-alex.netlify.app/

1. The website must contain a form with inputs for a URL, a title, and a description. The form should have a submit button.
2. Submitting the form adds a new bookmark for the relevant user only
3. After creating a new bookmark, the list of bookmarks for the current user is shown, including the new bookmark
4. Each bookmark’s “Copy to clipboard” button must copy the URL of the bookmark

How this was done:
Load site, check form, input new bookmark (URL, title and description), click submit
New bookmark was added to list of bookmarks and shown below for the relevant user
Switching user does not show the added bookmark
Switching back to original user and clicking copy URL copies correct url into clipboard

# The website must score 100 for accessibility in Lighthouse
Checked through Chrome:
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/a09585e8-e6c2-4a12-8eaa-02d081e07a6a" />


# Unit tests must be written for at least one non-trivial function - Complete
