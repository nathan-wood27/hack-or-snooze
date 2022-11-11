"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let $html = $(`
  <li id="${story.storyId}">
    <span class="heart"><i class="far fa-heart"></i></span>
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
`);
  currentUser.favorites.forEach(favStory => {
    if(favStory.storyId === story.storyId){
      console.log('This story is favorited',story);
      $html = $(`
      <li id="${story.storyId}">
        <span class="heart favorited"><i class="fas fa-heart"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
      return true
    }
    return false;
  });
  return $html;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$storySubmitForm.on("submit", addSubmittedStory);

async function addSubmittedStory(evt) {
  console.debug("story-submitted", evt);
  evt.preventDefault();

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const newStory = await storyList.addStory(currentUser,
    {title: title, author: author, url: url});

  const $storyWithMarkup = generateStoryMarkup(newStory);
  $allStoriesList.append($storyWithMarkup);

  $storySubmitForm.trigger("reset");
  $allStoriesList.show();
}

$allStoriesList.on('mouseenter','.heart:not(.favorited) i', function(){  
  this.classList.add('fas');
  this.classList.remove('far');
});
$allStoriesList.on('mouseleave','.heart:not(.favorited) i', function(){
  this.classList.add('far');
  this.classList.remove('fas');
});
$allStoriesList.on('click','.heart i', function(){
  this.classList.add('fas');
  this.classList.remove('far');
  const heart = this.parentElement;
  heart.classList.toggle('favorited');
  const thisStoryId = this.closest('li').id;
  storyList.stories.forEach(story => {
    if(thisStoryId === story.storyId && heart.classList.contains('favorited')){
      console.log(heart);
      currentUser.addFavorite(story);
    }
    else if(thisStoryId === story.storyId){
      currentUser.removeFavorite(story);
    }
  });
});