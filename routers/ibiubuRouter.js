const {
  updateUserState,
  appendUserNote
} = require("../memory/userMemory");

const INTENTS = {
  CALL: "call",
  TEXT: "text",
  JOIN: "join_membership",
  ONBOARD: "onboard_user",
  DEFINE_PATH: "define_ibiubu",
  PRIVATE_PROFILE: "private_profile",
  PUBLIC_PROFILE: "public_profile",
  BOOK_ARTIST: "book_artist",
  REAL_ESTATE: "real_estate",
  MORTGAGE: "mortgage",
  HELP: "help",
  UNKNOWN: "unknown"
};

function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (/\bcall\b/.test(t)) return INTENTS.CALL;
  if (/\b(text|sms|message)\b/.test(t)) return INTENTS.TEXT;
  if (/\b(join|sign me up|membership|register)\b/.test(t)) return INTENTS.JOIN;
  if (/\b(onboard|start me|guide me)\b/.test(t)) return INTENTS.ONBOARD;
  if (/\b(my path is|i am an artist|i'm an artist|my goal is)\b/.test(t)) return INTENTS.DEFINE_PATH;
  if (/\bprivate\b/.test(t)) return INTENTS.PRIVATE_PROFILE;
  if (/\bpublic\b/.test(t)) return INTENTS.PUBLIC_PROFILE;
  if (/\b(book artist|artist booking|book an artist|artist)\b/.test(t)) return INTENTS.BOOK_ARTIST;
  if (/\b(real estate|buy a house|sell my home|invest in property|house)\b/.test(t)) return INTENTS.REAL_ESTATE;
  if (/\b(mortgage|pre-approval|refinance|rates|loan)\b/.test(t)) return INTENTS.MORTGAGE;
  if (/\b(help|menu|options)\b/.test(t)) return INTENTS.HELP;

  return INTENTS.UNKNOWN;
}

function extractEntities(text = "") {
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{8,}\d)/);
  const quotedMatch = text.match(/["“](.*?)["”]/);

  return {
    phoneNumber: phoneMatch ? phoneMatch[1].replace(/[^\d+]/g, "") : null,
    quotedText: quotedMatch ? quotedMatch[1] : null
  };
}

async function routeMessage({ text, userId }) {
  const intent = detectIntent(text);
  const entities = extractEntities(text);

  switch (intent) {
    case INTENTS.JOIN:
      updateUserState(userId, {
        membershipStatus: "free",
        currentFlow: "membership",
        lastIntent: intent
      });
      appendUserNote(userId, "Started membership flow");
      return {
        intent,
        reply: "Welcome to IBIUBU. You are now in the membership flow. Tell me who you are and what you are committed to."
      };

    case INTENTS.ONBOARD:
      updateUserState(userId, {
        currentFlow: "onboarding",
        lastIntent: intent
      });
      appendUserNote(userId, "Started onboarding");
      return {
        intent,
        reply: "Let’s onboard you properly. Tell me what you’re building and where you need guidance first."
      };

    case INTENTS.DEFINE_PATH: {
      const lower = text.toLowerCase();
      let path = "general";
      if (lower.includes("artist")) path = "artist";
      else if (lower.includes("real estate")) path = "real_estate";
      else if (lower.includes("trust")) path = "trusts";

      updateUserState(userId, {
        ibiubuPath: path,
        lastIntent: intent
      });
      appendUserNote(userId, `Set IBIUBU path: ${path}`);
      return {
        intent,
        reply: `Locked in. Your IBIUBU path is now ${path}.`
      };
    }

    case INTENTS.PRIVATE_PROFILE:
      updateUserState(userId, {
        profileMode: "private",
        lastIntent: intent
      });
      appendUserNote(userId, "Set profile mode to private");
      return {
        intent,
        reply: "Your profile is now set to private."
      };

    case INTENTS.PUBLIC_PROFILE:
      updateUserState(userId, {
        profileMode: "public",
        lastIntent: intent
      });
      appendUserNote(userId, "Set profile mode to public");
      return {
        intent,
        reply: "Your profile is now set to public."
      };

    case INTENTS.BOOK_ARTIST:
      updateUserState(userId, {
        ibiubuPath: "artist",
        lastIntent: intent
      });
      return {
        intent,
        reply: "Artist flow ready. Send the artist name, event location, date, and budget."
      };

    case INTENTS.REAL_ESTATE:
      updateUserState(userId, {
        ibiubuPath: "real_estate",
        lastIntent: intent
      });
      return {
        intent,
        reply: "Real estate flow ready. Are you trying to buy, sell, or invest?"
      };

    case INTENTS.MORTGAGE:
      updateUserState(userId, {
        currentFlow: "mortgage",
        lastIntent: intent
      });
      return {
        intent,
        reply: "Mortgage flow ready. Do you need pre-approval, refinance, or rate guidance?"
      };

    case INTENTS.CALL:
      return {
        intent,
        reply: entities.phoneNumber
          ? `Call request captured for ${entities.phoneNumber}.`
          : "Send the phone number you want me to call."
      };

    case INTENTS.TEXT:
      return {
        intent,
        reply: entities.phoneNumber
          ? `Text request captured for ${entities.phoneNumber}.`
          : 'Send the number and message like: Text +13692290108 "Hello"'
      };

    case INTENTS.HELP:
      return {
        intent,
        reply: "Commands: /start, /join, /artist, /realestate, /mortgage, /private, /public."
      };

    default:
      updateUserState(userId, { lastIntent: intent });
      return {
        intent,
        reply: "I hear you. Tell me if you need artist help, real estate, mortgage, private profile, or membership."
      };
  }
}

module.exports = {
  INTENTS,
  detectIntent,
  extractEntities,
  routeMessage
};
