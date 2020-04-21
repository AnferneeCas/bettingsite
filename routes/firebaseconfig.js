
var admin = require("firebase-admin");
var serviceAccount = require(
  "../bettingsite-46549-firebase-adminsdk-l3tio-873884f359.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bettingsite-46549.firebaseio.com"
});

module.exports.admin= admin;