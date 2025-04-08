# 🧠 AI Therapist

An emotionally-aware conversational AI designed to provide a safe, supportive space for users to express themselves. Built with cutting-edge natural language understanding, sentiment analysis, and empathetic response generation, **AI Therapist** is your companion for mental well-being.

## 💡 Features

- 🗣️ **Conversational AI**: Engages in natural, human-like dialogue.
- ❤️ **Empathy Engine**: Detects emotional states and adapts responses.
- 🧘 **Mood Tracking**: Monitors mood progression over time.
- 📈 **Mental Health Insights**: Summarizes emotional trends with optional journaling.
- 🔐 **Privacy First**: No data is stored unless explicitly permitted by the user.

## 🛠️ Tech Stack

- **Python 3.10+**
- **FastAPI** – for serving the backend API
- **LangChain** – for managing conversation flow
- **LLM** – Gemini / GPT (configurable)
- **Sentiment Analysis** – VADER / Custom finetuned BERT
- **Vector DB** – FAISS / Chroma for long-term memory (optional)
- **Frontend** – Streamlit (or React-based UI)

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/dhawan98/ai-therapist.git
   cd ai-therapist    

2. **Create virtual environment**
   ```bash
    python -m venv venv   
    source venv/bin/activate  # or venv\Scripts\activate on Window    

3. **Install dependencies**
   ```bash
    pip install -r requirements.txt   

4. **Set up environment variables Create a .env file**
   ```bash
    OPENAI_API_KEY=your_openai_key   
    GEMINI_API_KEY=your_gemini_key    

5. **Run the app**
   ```bash
    uvicorn app.main:app --reload


6. **in another terminal:**
   ```bash
    streamlit run ui/app.py
