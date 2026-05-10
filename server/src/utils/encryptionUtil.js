const CryptoJS = require("crypto-js");

// --------------------------------------------------
// Environment Validation
// --------------------------------------------------
if (
  process.env.NODE_ENV === "production" &&
  !process.env.ENCRYPTION_KEY
) {
  throw new Error(
    "❌ ENCRYPTION_KEY is missing in production environment"
  );
}

// 🔐 Secure Secret Key
const SECRET_KEY =
  process.env.ENCRYPTION_KEY ||
  "dev_fallback_key_change_me";

// --------------------------------------------------
// Encrypt Text
// --------------------------------------------------
const encryptText = (text) => {
  try {
    if (text === null || text === undefined) {
      return "";
    }

    if (typeof text !== "string") {
      text = String(text);
    }

    if (!text.trim()) {
      return "";
    }

    const encrypted = CryptoJS.AES.encrypt(
      text,
      SECRET_KEY
    ).toString();

    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error.message);

    // Fallback (avoid crashing app)
    return text;
  }
};

// --------------------------------------------------
// Decrypt Text
// --------------------------------------------------
const decryptText = (cipherText) => {
  try {
    if (cipherText === null || cipherText === undefined) {
      return "";
    }

    if (typeof cipherText !== "string") {
      cipherText = String(cipherText);
    }

    if (!cipherText.trim()) {
      return "";
    }

    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      SECRET_KEY
    );

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // --------------------------------------------------
    // Handle legacy plain text data safely
    // --------------------------------------------------
    if (!decrypted) {
      return cipherText;
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error.message);

    // Fallback for corrupted / old data
    return cipherText;
  }
};

// --------------------------------------------------
// Optional Utility
// --------------------------------------------------
const isEncrypted = (value) => {
  try {
    if (!value || typeof value !== "string") {
      return false;
    }

    const bytes = CryptoJS.AES.decrypt(
      value,
      SECRET_KEY
    );

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return !!decrypted;
  } catch {
    return false;
  }
};

module.exports = {
  encryptText,
  decryptText,
  isEncrypted,
};