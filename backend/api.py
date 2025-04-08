import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import text2emotion as te

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY must be set in your environment")

# Configure Gemini
genai.configure(api_key=gemini_api_key)

app = FastAPI()

# Allow CORS for your frontend (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema for chat messages
class ChatRequest(BaseModel):
    user_input: str

# Helper function: detect emotion using text2emotion
def extract_emotion(text: str) -> str:
    emotions = te.get_emotion(text)
    if not emotions:
        return "neutral"
    return max(emotions, key=emotions.get)

# Prompt template for Whisper, your gentle AI companion
PROMPT_TEMPLATE ="""
You are Dr. Sage, a compassionate and professional therapist.
Your role is to listen carefully, provide reflective insights, and gently guide the client towards understanding and personal growth.
Speak clearly, respectfully, and with a focus on validated therapeutic techniques.
Use the following conversation history to inform your response.


Human: {user_input}
Whisper:"""

@app.post("/chat")
async def chat(request: ChatRequest):
    user_input = request.user_input
    prompt = PROMPT_TEMPLATE.format(user_input=user_input)
    
    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash")
        response = model.generate_content(prompt)
        ai_text = response.text.strip()
    except Exception as e:
        ai_text = f"Error generating response: {e}"
    
    emotion = extract_emotion(user_input)
    
    # You might later integrate conversation memory here.
    return {
        "response": ai_text,
        "emotion": emotion,
        "memory_tag": user_input[-80:]  # Replace with your desired logic for memory tagging
    }
