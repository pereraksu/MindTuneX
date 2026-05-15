MindTuneX 🧠✨

An AI-powered emotional wellness and mood intelligence platform built using the MERN stack and NLP technologies.
MindTuneX helps users understand emotional patterns through journal analysis, AI-driven mood detection, emotional insights, personalized support recommendations, and mental wellness analytics.


🌟 Features

👤 User Features

Secure Authentication & Authorization

Daily AI Journal System

Emotion Detection using NLP

Mood Analysis Dashboard

Mood History Tracking

Weekly Emotional Insights

Personalized Emotional Support

AI-generated Recommendations

Music & Audio Therapy Suggestions

PDF Wellness Report Generation

AI Chatbot Support

Dark / Light Theme Toggle

Responsive Modern UI



🛡️ Admin Features

Admin Dashboard Analytics

Manage Platform Users

High-Risk Emotion Detection

Risk Alert Monitoring

System Analytics Reports

User Wellness Monitoring

Executive PDF Report Export



🧠 AI / Machine Learning Features

MindTuneX integrates Natural Language Processing (NLP) to analyze user journal entries and identify emotional states.

Supported Emotions

Joy

Calm

Stress

Anxiety

Sadness

Anger

Fatigue

Love

Fear

Disgust

Surprise

Neutral


AI Technologies

DistilBERT

Transformers

PyTorch

FastAPI AI Service

Emotion Classification

Sentiment Analysis

Explainable AI Concepts



🛠️ Tech Stack

Frontend

React.js

Tailwind CSS

Recharts

React Router DOM

jsPDF

html-to-image


Backend

Node.js

Express.js

MongoDB

JWT Authentication


AI Service

Python

FastAPI

HuggingFace Transformers

DistilBERT


📂 Project Structure

MindTuneX/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── ai-service/
│   ├── model/
│   ├── main.py
│   └── requirements.txt
│
└── README.md


🚀 Installation

1️⃣ Clone Repository

git clone https://github.com/pereraksu/MindTuneX.git
cd MindTuneX


2️⃣ Install Frontend Dependencies

cd frontend
npm install


3️⃣ Install Backend Dependencies

cd backend
npm install


4️⃣ Install AI Service Dependencies

cd ai-service
pip install -r requirements.txt


⚙️ Environment Variables

Create a .env file inside backend folder.

PORT=5000
MONGO_URI=mongodb+srv://sasiniuththara341_db_user:<Sasini2002>@mindtunex-cluster.hkr8yqo.mongodb.net/?appName=mindtunex-cluster
JWT_SECRET=mindtunex_super_secret_2026
AI_SERVICE_URL=http://localhost:8000


▶️ Run the Project

Frontend

npm run dev

Backend

npm run server

AI Service

python -m uvicorn app.main:app --reload --port 8000


📊 Key Functionalities

✍️ Journal Analysis

Users can submit daily journal entries which are analyzed using AI to detect emotional states and sentiment polarity.


📈 Mood Analytics

The platform visualizes emotional trends and mood distributions using interactive charts and reports.


🆘 Emotional Support

Based on detected emotions, MindTuneX provides:

Personalized recommendations

Wellness suggestions

Audio therapy playlists

Supportive guidance


🚨 Risk Detection

The system identifies emotionally sensitive or high-risk entries and alerts administrators for review.


🔐 Security Features

JWT Authentication

Protected Routes

Admin Authorization

Secure API Access

Role-Based Access Control

📄 PDF Reporting

MindTuneX supports downloadable PDF reports for:

User Mood Reports

Emotional Analytics

Admin System Reports


🎨 UI/UX Design Highlights

Premium Glassmorphism UI

Dark / Light Mode

Responsive Design

Interactive Charts

Smooth Animations

Emotion-based Color System


📚 Future Improvements

Real-time Emotion Monitoring

Voice Emotion Analysis

Therapist Integration

AI Conversational Companion

Multi-language Support

Mobile Application


👩‍💻 Developed By

Koralalage Perera
BSc (Hons) Computer Science
University of Plymouth
