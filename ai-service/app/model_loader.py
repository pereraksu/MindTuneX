import json
import os
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel

# ─── File Path Setup ───
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "saved_model")

CONFIG_PATH = os.path.join(MODEL_DIR, "config.json")
LABEL_MAPS_PATH = os.path.join(MODEL_DIR, "label_maps.json")
WEIGHTS_PATH = os.path.join(MODEL_DIR, "model_weights.pt")

# ─── Config & Maps Load කිරීම ───
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    CONFIG = json.load(f)

with open(LABEL_MAPS_PATH, "r", encoding="utf-8") as f:
    LABEL_MAPS = json.load(f)

BASE_MODEL = CONFIG["base_model"]
MAX_LENGTH = CONFIG["max_length"]

# 🚀 වැදගත් වෙනස: 
# Threshold එක 0.30 දක්වා අඩු කළා. එතකොට AI එකට පොඩි සැකයක් තිබුණත් 
# ඒක Neutral නොකර අදාළ හැඟීමම පෙන්වනවා.
CONFIDENCE_THRESHOLD = CONFIG.get("confidence_threshold", 0.30) 

EMOTION2ID = LABEL_MAPS["emotion2id"]
ID2EMOTION = {int(k): v for k, v in LABEL_MAPS["id2emotion"].items()}
NUM_LABELS = len(ID2EMOTION)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ─── Model Architecture (MindTuneX Classifier) ───
class MindTuneXClassifier(nn.Module):
    def __init__(self, base_model: str, num_labels: int, dropout: float = 0.3):
        super().__init__()
        # 🚀 Encoder එක විදිහට DistilBERT වැනි Transformer මොඩල් එකක් පාවිච්චි කරයි
        self.encoder = AutoModel.from_pretrained(base_model)
        hidden_size = self.encoder.config.hidden_size

        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, 256),
            nn.LayerNorm(256),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(256, num_labels),
        )

    def forward(self, input_ids, attention_mask):
        outputs = self.encoder(input_ids=input_ids, attention_mask=attention_mask)
        # 🚀 CLS Token එක පමණක් ගෙන Classification එක සිදු කරයි
        cls_token = outputs.last_hidden_state[:, 0, :]
        cls_token = self.dropout(cls_token)
        logits = self.classifier(cls_token)
        return logits

# ─── Load Tokenizer & Model Weights ───
print(f"Loading MindTuneX AI Model on {DEVICE}...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)

model = MindTuneXClassifier(BASE_MODEL, NUM_LABELS, dropout=0.3).to(DEVICE)

# කලින් Save කරගත් Weights (model_weights.pt) load කිරීම
try:
    state_dict = torch.load(WEIGHTS_PATH, map_location=DEVICE)
    model.load_state_dict(state_dict)
    model.eval()
    print("AI Model loaded successfully! ✅")
except Exception as e:
    print(f"Error loading model weights: {e} ❌")