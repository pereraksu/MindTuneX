const CryptoJS = require("crypto-js");

// 🔐 MUST use .env key (fallback only for dev)
const SECRET_KEY = process.env.ENCRYPTION_KEY || "dev_fallback_key_change_me";

// --------------------------------------------------
// 🔒 Encrypt Text
// --------------------------------------------------
const encryptText = (text) => {
  if (!text || typeof text !== "string") return text;

  try {
    const cipher = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    return cipher;
  } catch (error) {
    console.error("Encryption error:", error.message);
    return text;
  }
};

// --------------------------------------------------
// 🔓 Decrypt Text
// --------------------------------------------------
const decryptText = (cipherText) => {
  if (!cipherText || typeof cipherText !== "string") return cipherText;

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // 🔥 Handle old unencrypted data safely
    return originalText || cipherText;
  } catch (error) {
    console.error("Decryption error:", error.message);
    return cipherText;
  }
};

module.exports = {
  encryptText,
  decryptText,
};