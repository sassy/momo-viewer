const {app, BrowserWindow} = require('electron');
const OAuth = require('oauth');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;

function setupToken() {
  const tokenStr = fs.readFileSync('./token.json', 'utf-8');
  return JSON.parse(tokenStr);
}

function createWindow() {
  const token = setupToken();

  win = new BrowserWindow({
    width:800,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  });

  const oauth = new OAuth.OAuth(
      'https://www.tumblr.com/oauth/request_token',
      'https://www.tumblr.com/oauth/access_token',
      token.consumer_key,
      token.consumer_secret,
      '1.0A',
      'http://github.com/sassy',
      'HMAC-SHA1'
  );

  const load_url = url.format({
    pathname: path.join(__dirname, 'index.html'),
    query: {'token': token.consumer_key },
    protocol: 'file:',
    slashes: true
  });
  win.loadURL(load_url);
  /*
  oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
    const authURL = 'https://www.tumblr.com/oauth/authorize?oauth_token=' + oauth_token;
    win.loadURL(authURL);
  });

  win.on('closed', () => {
    win = null;
  });

  win.webContents.on('will-navigate', (event, navigate_url) => {
    const match = navigate_url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&*])/);
    const oauth_token = match[1];
    if (match) {
      event.preventDefault();
      const load_url = url.format({
        pathname: path.join(__dirname, 'index.html'),
        query: {'token': token.consumer_key },
        protocol: 'file:',
        slashes: true
      });
      win.loadURL(load_url);
    }
  });
  */

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
