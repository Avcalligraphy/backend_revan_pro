// server.js
import express from "express";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "./config/serviceAccountKey.json");
console.log("Service Account Path:", serviceAccountPath);

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Inisialisasi admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

async function sendNotification(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await messaging.send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const app = express();
const port = 3001;

app.get("/send-notification", async (req, res) => {
  const { token, title, body } = req.query;
  await sendNotification(token, title, body);
  res.send("Notification sent");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
