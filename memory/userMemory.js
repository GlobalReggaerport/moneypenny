const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(process.env.DATA_DIR || "./data/users");

function getUserFile(userId) {
  return path.join(DATA_DIR, `${String(userId)}.json`);
}

function createDefaultUser(userId, username = "Unknown") {
  const now = new Date().toISOString();
  return {
    userId: String(userId),
    username,
    membershipStatus: "none",
    currentFlow: "none",
    ibiubuPath: "",
    profileMode: "private",
    lastIntent: "",
    notes: [],
    createdAt: now,
    updatedAt: now
  };
}

function loadFromMemory(userId) {
  const file = getUserFile(userId);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveToMemory(userId, data) {
  const payload = {
    ...data,
    userId: String(userId),
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(getUserFile(userId), JSON.stringify(payload, null, 2));
  return payload;
}

function getOrCreateUser(userId, username = "Unknown") {
  const existing = loadFromMemory(userId);
  if (existing) return existing;
  const created = createDefaultUser(userId, username);
  return saveToMemory(userId, created);
}

function updateUserState(userId, patch) {
  const user = getOrCreateUser(userId);
  return saveToMemory(userId, { ...user, ...patch });
}

function appendUserNote(userId, note) {
  const user = getOrCreateUser(userId);
  const notes = Array.isArray(user.notes) ? user.notes : [];
  notes.push({
    timestamp: new Date().toISOString(),
    note
  });
  return saveToMemory(userId, { ...user, notes });
}

module.exports = {
  createDefaultUser,
  loadFromMemory,
  saveToMemory,
  getOrCreateUser,
  updateUserState,
  appendUserNote
};
