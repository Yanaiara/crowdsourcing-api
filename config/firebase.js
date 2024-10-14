const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://acessiblidade-mapa-default-rtdb.firebaseio.com",
});

const db = admin.database();

module.exports = db;
