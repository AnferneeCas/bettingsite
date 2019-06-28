
var admin = require("firebase-admin");
var serviceAccount = require(
  "../bettingsite-35e9c-firebase-adminsdk-u7zyw-6567587c93.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bettingsite-35e9c.firebaseio.com"
});

module.exports.admin= admin;