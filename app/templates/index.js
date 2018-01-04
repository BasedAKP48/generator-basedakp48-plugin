/**
 * Welcome to your new BasedAKP48 plugin, "<%= moduleName %>"! Let's get started!
 */

// firebase-admin is what allows us to connect to the Firebase database.
const admin = require('firebase-admin');
// plugin-utils give us access to useful functions
const utils = require('@basedakp48/plugin-utils');
// Load our pakage data, for use in presence
const pkg = require('./package.json');

/**
 * A serviceAccount.json file is required to connect.
 * You can retrieve your serviceAccount.json file from the Firebase web interface.
 */
const serviceAccount = require("./serviceAccount.json");

// Initialize the Firebase app.
utils.initialize(admin, serviceAccount);

const rootRef = admin.database().ref();

// Listen to all messages (made after we started)
rootRef.child('messages').orderByChild('timeReceived').startAt(Date.now()).on('child_added', (e) => {
  let msg = e.val();

  let text = msg.text.toLowerCase();
  if (text === 'test') {
    sendMessage(msg, 'It works!');
  }
});

function sendMessage(msg, text) {
  // Create a response using data from the existing message
  let response = utils.getReply(msg, pgk.name, text);

  return rootRef.child('pendingMessages').push(response);
}
