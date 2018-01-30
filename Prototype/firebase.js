/** Firebase DB helper file **/

/** required modules **/
var admin = require("firebase-admin");

/** required files **/
var serviceAccount = require("./secret/dragonevents-firebase-adminsdk.json");

/** initialize app **/
var app = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://dragonevents-ac729.firebaseio.com"
});

var db = app.database().ref().once('value');

module.exports = {
  get_connection: function() {
	  return get_connection();
  }
};

function get_connection() {
		return db;
}