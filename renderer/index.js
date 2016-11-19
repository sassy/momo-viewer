'use strict';

const {createStore} = require('redux');

//Actoin Creater
function incrementImg() {
  return {type: 'INCREMENT_IMG'};
}

//Reducer
function imageState(state = {index: 0}, action) {
  switch(action.type) {
  case 'INCREMENT_IMG':
    return {index : state.index + 1};
  default:
    return state;
  }
}

const store = createStore(imageState, {index: 0});
let imageArray = [];


function changeImage() {
  store.dispatch(incrementImg());
  document.getElementById('image1').src = imageArray[ store.getState().index];
}

let apikey = location.href.split('?')[1].split('=')[1];
let url = 'https://api.tumblr.com/v2/blog/';
url += 'momokophoto.tumblr.com';
url += '/posts/photo/?';
url += 'api_key=';
url += apikey;
fetch(url).then((res) => {
  return res.json()
}).then((json) => {
  let str = '';
  json.response.posts.forEach(function(post) {

    imageArray.push(post.photos[0].alt_sizes[1].url);
  });
  document.getElementById('image1').src = imageArray[store.getState().index];
});
