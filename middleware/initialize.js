var admin = require("firebase-admin");
var serviceAccount = require("../firebasecreds.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
