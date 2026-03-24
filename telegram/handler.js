const axios = require("axios");
const memory = require("../memory/userMemory");
const router = require("../routers/ibiubuRouter");
const commands = require("./commands");
const { handleCallback } = require("./callbackHandler");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramMessage(chatId, payload) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("[TELEGRAM MOCK SEND]", chatId, payload);
    return;
  }

  await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: payload.text,
    reply_markup: payload.reply_markup
  });
}

async function handleMessage(message) {
  const text = message.text || "";
  const chatId = message.chat.id;
  const userId = message.from.id;
  const username = message.from.username || message.from.first_name || "Unknown";

  const existing = memory.loadFromMemory(userId);
  const isNew = !existing;
  const user = memory.getOrCreateUser(userId, username);

  let response;

  switch (text.trim()) {
    case "/start":
      response = commands.handleStart(user, isNew);
      break;
    case "/help":
      response = commands.handleHelp();
      break;
    case "/join":
      response = commands.handleJoin(userId);
      break;
    case "/artist":
      response = commands.handleArtist(userId);
      break;
    case "/realestate":
      response = commands.handleRealEstate(userId);
      break;
    case "/mortgage":
      response = commands.handleMortgage(userId);
      break;
    case "/private":
      response = commands.handlePrivate(userId);
      break;
    case "/public":
      response = commands.handlePublic(userId);
      break;
    default: {
      const result = await router.routeMessage({ text, userId, username, chatId });
      response = { text: result.reply };
    }
  }

  await sendTelegramMessage(chatId, response);
}

async function handleCallbackQuery(callbackQuery) {
  const userId = callbackQuery.from.id;
  const chatId = callbackQuery.message.chat.id;
  const username = callbackQuery.from.username || callbackQuery.from.first_name || "Unknown";
  const existing = memory.loadFromMemory(userId);
  const isNew = !existing;
  const user = memory.getOrCreateUser(userId, username);

  const response = handleCallback(callbackQuery.data, userId, user, isNew);
  await sendTelegramMessage(chatId, response);
}

async function handleUpdate(update) {
  if (update.message) {
    await handleMessage(update.message);
  } else if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
  }
}

module.exports = {
  handleUpdate
};
