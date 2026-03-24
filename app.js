require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const telegramHandler = require("./telegram/handler");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || "./data/users";

app.use(express.json());
fs.mkdirSync(path.resolve(DATA_DIR), { recursive: true });

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      telegram: !!process.env.TELEGRAM_BOT_TOKEN
    }
  });
});

app.post("/webhooks/telegram", async (req, res) => {
  try {
    await telegramHandler.handleUpdate(req.body);
  } catch (error) {
    console.error("[TELEGRAM WEBHOOK ERROR]", error.message);
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});
