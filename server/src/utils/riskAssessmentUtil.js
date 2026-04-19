const HIGH_RISK_EMOTIONS = ["stress", "anxiety", "sadness", "fear", "anger"];
const MODERATE_RISK_EMOTIONS = ["fatigue", "disgust"];
const POSITIVE_EMOTIONS = ["joy", "calm", "love", "surprise"];

const calculateRiskScore = ({
  predictedEmotion = "neutral",
  sentimentLabel = "neutral",
  confidence = 0,
  supportLevel = "moderate",
  text = "",
  previousNegativeCount = 0,
}) => {
  let score = 0;

  const emotion = String(predictedEmotion).toLowerCase();
  const sentiment = String(sentimentLabel).toLowerCase();
  const support = String(supportLevel).toLowerCase();
  const inputText = String(text).toLowerCase();

  if (HIGH_RISK_EMOTIONS.includes(emotion)) score += 35;
  else if (MODERATE_RISK_EMOTIONS.includes(emotion)) score += 20;
  else if (POSITIVE_EMOTIONS.includes(emotion)) score -= 10;

  if (sentiment === "negative") score += 20;
  else if (sentiment === "positive") score -= 8;

  if (support === "high") score += 25;
  else if (support === "moderate") score += 10;

  if (confidence >= 0.8) score += 10;
  else if (confidence >= 0.6) score += 6;

  const crisisKeywords = [
    "hopeless",
    "worthless",
    "panic",
    "can't cope",
    "helpless",
    "empty",
    "overwhelmed",
    "exhausted",
    "lonely",
  ];

  const matchedKeywords = crisisKeywords.filter((word) => inputText.includes(word));
  score += matchedKeywords.length * 5;

  if (previousNegativeCount >= 5) score += 10;
  if (previousNegativeCount >= 10) score += 10;

  score = Math.max(0, Math.min(100, score));

  return score;
};

const getRiskBand = (riskScore) => {
  if (riskScore >= 75) return "critical";
  if (riskScore >= 50) return "high";
  if (riskScore >= 25) return "moderate";
  return "low";
};

module.exports = {
  calculateRiskScore,
  getRiskBand,
};