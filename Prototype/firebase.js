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

var db = app.database().ref();

module.exports = {
  get_connection: function() {
	  return get_connection();
  },
  create_event: function(a,b,c,d,e) {
	  return create_event(a,b,c,d,e);
  }
};

function get_connection() {
		return db;
}

/** Create a new event in the database **/
function create_event(eventName, eventDescription, eventStart, eventEnd, eventOwnedBy) {
	var eventsRef = app.database().ref('events');
	// create a new event and return its ID
	return eventsRef.push({
		name: eventName,
		desc: eventDescription,
		start: eventStart,
		end: eventEnd,
		user: eventOwnedBy
	}).key;
}