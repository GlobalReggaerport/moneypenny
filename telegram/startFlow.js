function newUserWelcome() {
  return {
    text:
      "Welcome to IBIUBU.\n\nI see a lot of people come here trying to figure things out on their own — you don't have to do that here.\n\nAt IBIUBU, we guide you step by step.\n\nWhat are you trying to get into?",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎤 Artist / Music", callback_data: "artist" }],
        [{ text: "🏠 Real Estate", callback_data: "real_estate" }],
        [{ text: "🛡 Trusts / Wealth", callback_data: "trusts" }],
        [{ text: "📞 Call Me", callback_data: "call" }],
        [{ text: "💬 Text Me", callback_data: "text" }],
        [{ text: "❓ Help", callback_data: "help" }]
      ]
    }
  };
}

function returningUserWelcome(user) {
  return {
    text:
      `Welcome back, ${user.username || "friend"}!\n\n` +
      `I see you're focused on ${(user.ibiubuPath || "general").toUpperCase()}.\n` +
      `Last time, you were working on ${user.currentFlow || "general"}.\n\n` +
      `What would you like to work on today?`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎤 Artist / Music", callback_data: "artist" }],
        [{ text: "🏠 Real Estate", callback_data: "real_estate" }],
        [{ text: "🛡 Trusts / Wealth", callback_data: "trusts" }],
        [{ text: "📞 Call Me", callback_data: "call" }],
        [{ text: "💬 Text Me", callback_data: "text" }],
        [{ text: "❓ Help", callback_data: "help" }]
      ]
    }
  };
}

module.exports = {
  newUserWelcome,
  returningUserWelcome
};
