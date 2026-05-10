MindTuneX Emotion Classifier - Final Model Package

Project:
MindTuneX

Base Model:
distilbert-base-uncased

Architecture:
DistilBERT encoder with custom classification head.

Emotion Classes:
joy, calm, stress, anxiety, sadness, anger, fatigue, love, fear, disgust, surprise, neutral

Best Epoch:
4

Confidence Threshold:
0.6

Final Test Metrics:
- Loss: 0.5521
- Accuracy: 79.78%
- Macro F1: 83.07%
- Weighted F1: 79.69%

Included Files:
- model_weights.pt
- tokenizer files
- config.json
- inference_meta.json
- training_meta.json
- final_evaluation_summary.json

Notes:
This package contains the final selected checkpoint based on validation macro F1
with validation-loss penalty. Low-confidence predictions should be handled using
the configured confidence threshold and fallback rules.