const { updateUserState, appendUserNote } = require("../memory/userMemory");
const { newUserWelcome, returningUserWelcome } = require("./startFlow");

function handleStart(user, isNew) {
  appendUserNote(user.userId, "Used /start");
  return isNew ? newUserWelcome() : returningUserWelcome(user);
}

function handleHelp() {
  return {
    text: "Commands:\n/start\n/join\n/artist\n/realestate\n/mortgage\n/private\n/public"
  };
}

function handleJoin(userId) {
  updateUserState(userId, {
    membershipStatus: "free",
    currentFlow: "membership",
    lastIntent: "join_membership"
  });
  appendUserNote(userId, "Used /join");
  return {
    text: "Membership flow started. Tell me who you are and what you want to build."
  };
}

function handleArtist(userId) {
  updateUserState(userId, {
    ibiubuPath: "artist",
    lastIntent: "book_artist"
  });
  return { text: "Artist path set. Send artist name, location, date, and budget." };
}

function handleRealEstate(userId) {
  updateUserState(userId, {
    ibiubuPath: "real_estate",
    lastIntent: "real_estate"
  });
  return { text: "Real estate path set. Are you buying, selling, or investing?" };
}

function handleMortgage(userId) {
  updateUserState(userId, {
    currentFlow: "mortgage",
    lastIntent: "mortgage"
  });
  return { text: "Mortgage flow set. Do you need pre-approval, refinance, or rates?" };
}

function handlePrivate(userId) {
  updateUserState(userId, {
    profileMode: "private",
    lastIntent: "private_profile"
  });
  return { text: "Your profile is now private." };
}

function handlePublic(userId) {
  updateUserState(userId, {
    profileMode: "public",
    lastIntent: "public_profile"
  });
  return { text: "Your profile is now public." };
}

module.exports = {
  handleStart,
  handleHelp,
  handleJoin,
  handleArtist,
  handleRealEstate,
  handleMortgage,
  handlePrivate,
  handlePublic
};
