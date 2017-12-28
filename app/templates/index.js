/**
 * Welcome to your new BasedAKP48 plugin, "<%= moduleName %>"! Let's get started!
 */

// firebase-admin is what allows us to connect to the Firebase database.
const admin = require('firebase-admin');

/**
 * A serviceAccount.json file is required to connect.
 * You can retrieve your serviceAccount.json file from the Firebase web interface.
 */
const serviceAccount = require("./serviceAccount.json");

// Initialize the Firebase app. Change the URL below if you're using another Firebase database.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const rootRef = admin.database().ref();

// Listen to all messages (made after we started)
rootRef.child('messages').orderByChild('timeReceived').startAt(Date.now()).on('child_added', readMessage);

// Listen to messages sent directly to us (including pre-existing messages)
rootRef.child('clients/<%= moduleName %>').on('child_added', (e) => {
  readMessage(e);
  e.ref.delete(); // Delete messages after handling them
});

// Send test message
sendMessage('test');

function readMessage(e) {
  let msg = e.val();
  console.log(msg);
  let text = msg.text.toLowerCase();

	if(text == 'test') {
		sendMessage(msg, 'It works!');
	}
}

function sendMessage(text) {
  let response = {
    uid: '<%= moduleName %>',
    target: '<%= moduleName %>',
    text: text,
    channel: 'testChannel',
    msgType: 'chatMessage',
    timeReceived: Date.now()
  }

  return rootRef.child('pendingMessages').push().set(response);
}
