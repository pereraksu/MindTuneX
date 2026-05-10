const axios = require("axios");

const AI_SERVICE_URL = "http://127.0.0.1:8000/predict";

const predictEmotion = async (text) => {
  try {
    const response = await axios.post(AI_SERVICE_URL, {
      text,
    });

    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);

    return {
      emotion: "neutral",
      confidence: 0,
    };
  }
};

module.exports = {
  predictEmotion,
};