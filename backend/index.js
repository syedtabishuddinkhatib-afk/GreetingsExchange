const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

const sqs = new AWS.SQS();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

app.post("/api/submit", async (req, res) => {
  await sqs.sendMessage({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify(req.body)
  }).promise();

  res.json({ status: "queued" });
});

app.post("/api/subscribe", async (req, res) => {
  const { endpoint, keys } = req.body;
  await pool.query(
    `INSERT INTO push_subscriptions(endpoint,p256dh,auth)
     VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
    [endpoint, keys.p256dh, keys.auth]
  );
  res.json({ status: "stored" });
});

app.listen(3000);
