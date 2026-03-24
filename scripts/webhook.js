require("dotenv").config();
const axios = require("axios");

const token = process.env.TELEGRAM_BOT_TOKEN;
const base = process.env.APP_BASE_URL;

async function register() {
  const url = `https://api.telegram.org/bot${token}/setWebhook`;
  const webhookUrl = `${base}/webhooks/telegram`;
  const { data } = await axios.post(url, { url: webhookUrl });
  console.log(data);
}

async function info() {
  const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;
  const { data } = await axios.get(url);
  console.log(data);
}

async function del() {
  const url = `https://api.telegram.org/bot${token}/deleteWebhook`;
  const { data } = await axios.get(url);
  console.log(data);
}

const cmd = process.argv[2];
if (cmd === "register") register();
else if (cmd === "info") info();
else if (cmd === "delete") del();
else console.log("Use: node scripts/webhook.js register|info|delete");
