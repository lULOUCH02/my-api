const admin = require('firebase-admin');
const express = require('express');
const app = express();

app.use(express.json()); // for parsing application/json

// Load service account from environment variable and parse it
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://manga-275b2-default-rtdb.europe-west1.firebasedatabase.app" // استبدل بالرابط الخاص بمشروعك
});

// Get a reference to the database (Realtime Database)
const db = admin.database();

// Example: Read data
app.get('/menu', async (req, res) => {
  try {
    const snapshot = await db.ref('/menu').once('value');
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Example: Write data
app.post('/menu', async (req, res) => {
  try {
    await db.ref('/menu').set(req.body);
    res.send("Menu updated successfully");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Start server
const PORT = process.env.PORT || 3000; // عادة Render يحدد PORT في env
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
