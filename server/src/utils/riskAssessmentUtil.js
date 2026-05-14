const HIGH_RISK_EMOTIONS = [
  "stress",
  "anxiety",
  "sadness",
  "fear",
  "anger",
];

const MODERATE_RISK_EMOTIONS = [
  "fatigue",
  "disgust",
];

const POSITIVE_EMOTIONS = [
  "joy",
  "calm",
  "love",
  "surprise",
];

// Crisis Keywords
const CRISIS_KEYWORDS = [
  "hopeless",
  "worthless",
  "panic",
  "can't cope",
  "cannot cope",
  "helpless",
  "empty",
  "overwhelmed",
  "exhausted",
  "lonely",
  "stuck",
  "depressed",
  "give up",
  "burned out",
  "burnt out",
  "numb",
  "unwanted",
];

// Calculate Risk Score
const calculateRiskScore = ({
  predictedEmotion = "neutral",
  sentimentLabel = "neutral",
  confidence = 0,
  supportLevel = "moderate",
  text = "",
  previousNegativeCount = 0,
}) => {
  let score = 0;

  // Normalize Inputs
  const emotion = String(predictedEmotion)
    .trim()
    .toLowerCase();

  const sentiment = String(sentimentLabel)
    .trim()
    .toLowerCase();

  const support = String(supportLevel)
    .trim()
    .toLowerCase();

  const inputText = String(text)
    .trim()
    .toLowerCase();

  // Emotion Weight
  if (HIGH_RISK_EMOTIONS.includes(emotion)) {
    score += 35;
  } else if (
    MODERATE_RISK_EMOTIONS.includes(emotion)
  ) {
    score += 20;
  } else if (
    POSITIVE_EMOTIONS.includes(emotion)
  ) {
    score -= 10;
  }

  // Sentiment Weight
  if (sentiment === "negative") {
    score += 20;
  } else if (sentiment === "positive") {
    score -= 8;
  }

  // Support Level Weight
  if (support === "high") {
    score += 25;
  } else if (support === "moderate") {
    score += 10;
  }

  // Confidence Weight
  if (confidence >= 0.9) {
    score += 12;
  } else if (confidence >= 0.8) {
    score += 10;
  } else if (confidence >= 0.6) {
    score += 6;
  }

  // Crisis Keyword Detection
  const matchedKeywords = CRISIS_KEYWORDS.filter(
    (word) => inputText.includes(word)
  );

  score += matchedKeywords.length * 5;

  // Historical Emotional Pattern
  if (previousNegativeCount >= 3) {
    score += 5;
  }

  if (previousNegativeCount >= 5) {
    score += 10;
  }

  if (previousNegativeCount >= 10) {
    score += 10;
  }

  // Protective Positive Language
  const positiveIndicators = [
    "hope",
    "better",
    "improving",
    "grateful",
    "supportive",
    "recovering",
  ];

  const hasPositiveIndicator =
    positiveIndicators.some((word) =>
      inputText.includes(word)
    );

  if (hasPositiveIndicator) {
    score -= 5;
  }

  // Final Clamp
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
};

// Risk Band
const getRiskBand = (riskScore = 0) => {
  if (riskScore >= 75) {
    return "critical";
  }

  if (riskScore >= 50) {
    return "high";
  }

  if (riskScore >= 25) {
    return "moderate";
  }

  return "low";
};

// Risk Metadata Helper
const getRiskMetadata = (riskScore = 0) => {
  const band = getRiskBand(riskScore);

  const metadata = {
    low: {
      color: "#10b981",
      label: "Low Risk",
    },

    moderate: {
      color: "#f59e0b",
      label: "Moderate Risk",
    },

    high: {
      color: "#f97316",
      label: "High Risk",
    },

    critical: {
      color: "#ef4444",
      label: "Critical Risk",
    },
  };

  return metadata[band];
};

module.exports = {
  calculateRiskScore,
  getRiskBand,
  getRiskMetadata,
};