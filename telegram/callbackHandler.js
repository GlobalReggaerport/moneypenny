const commands = require("./commands");

function handleCallback(data, userId, user, isNew = false) {
  switch (data) {
    case "artist":
      return commands.handleArtist(userId);
    case "real_estate":
      return commands.handleRealEstate(userId);
    case "trusts":
      return { text: "Trusts flow coming next. Tell me if you want trust setup, asset protection, or wealth structure." };
    case "call":
      return { text: "Send the phone number you want me to call." };
    case "text":
      return { text: 'Send the number and message like: Text +13692290108 "Hello"' };
    case "help":
      return commands.handleHelp();
    default:
      return commands.handleStart(user, isNew);
  }
}

module.exports = {
  handleCallback
};
