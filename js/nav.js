"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`User: ${currentUser.username}`).show();  
  $loggedInNav.show();
}

$navStorySubmit.on("click", navSubmitStoryClick);

function navSubmitStoryClick() {
  console.debug("navSubmitStoryClick");
  hidePageComponents();
  $storySubmitForm.show();
  
}

$navStoryFavorites.on("click", () => {
  hidePageComponents();
  getAndShowStoriesFromCurrUser('favorites');
});
$navStoryMySubmissions.on("click", () => {
  hidePageComponents();
  mySubmissionsShowing = true;
  getAndShowStoriesFromCurrUser('ownStories');
});