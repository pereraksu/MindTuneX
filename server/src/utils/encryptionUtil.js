const CryptoJS = require("crypto-js");

// .env එකෙන් key එක ගන්නවා
const SECRET_KEY = process.env.ENCRYPTION_KEY || "fallback_secret_key";

// 1. Text එක Encrypt කරන (කියවන්න බැරි කරන) Function එක
const encryptText = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// 2. Encrypt කරපු එක ආපහු සාමාන්‍ය අකුරු (Decrypt) කරන Function එක
const decryptText = (cipherText) => {
  if (!cipherText) return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // පරණ (Encrypt නොකරපු) දත්ත තිබ්බොත් එරර් එන්නේ නැති වෙන්න
    return originalText || cipherText; 
  } catch (error) {
    return cipherText;
  }
};

module.exports = { encryptText, decryptText };