'use strict';

const {createStore} = require('redux');

//Actoin Creater
function incrementImg() {
  return {type: 'INCREMENT_IMG'};
}

//Reducer
function imageState(state = {index: 0, images:[]}, action) {
  switch(action.type) {
  case 'INCREMENT_IMG':
    let index = state.images.length - 1 <= state.index ? 0 : state.index + 1;
    return Object.assign({}, state, {
      index: index
    });
  default:
    return state;
  }
}

let store;
let imageArray = [];

function changeImage() {
  store.dispatch(incrementImg());
  const image1 = document.getElementById('image1');
  image1.setAttribute('class', 'slide transition');
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
  store = createStore(imageState, {index: 0, images: imageArray});
  const state = store.getState();
  document.getElementById('image1').src = state.images[state.index];
});

document.getElementById('image1').addEventListener('webkitTransitionEnd', (e) => {
  const image1 = document.getElementById('image1');
  image1.setAttribute('class', 'slide');
  const state = store.getState();
  image1.src = state.images[state.index];
}, false);
