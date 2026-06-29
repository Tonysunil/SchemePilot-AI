# SchemePilot AI 🚀

SchemePilot AI is an advanced, multilingual, AI-powered platform designed to bridge the gap between Indian citizens and government welfare schemes. It simplifies the complex landscape of government schemes by helping users discover, understand, and track their applications for the schemes they are eligible for.

## 🌟 Core Features

- **Multilingual AI Chatbot:** Powered by Google's Gemini 2.5 Flash and LangGraph, the AI acts as a personal guide. It can speak seamlessly in 6 languages (English, Hindi, Marathi, Odia, Tamil, Telugu) and automatically determines your eligibility for various schemes based on your profile.
- **Dynamic Schemes Library:** A beautiful, responsive library of official government schemes fetched dynamically from a FastAPI backend.
- **Application Workflow & Checklist:** Found a scheme you like? Click "Add to Checklist & Apply" to instantly extract the exact required documents for that scheme and add them to your personalized Dashboard checklist.
- **User Dashboard:** Powered by Supabase Auth and Database, allowing users to track their saved schemes, manage their application document checklists, and update their personal profiles.
- **Vector Search (RAG):** Integrates Pinecone Vector Database for lightning-fast, semantic searches across government scheme data, ensuring the AI always provides accurate, grounded answers.

## 🛠️ Technology Stack

**Frontend:**
- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [shadcn/ui](https://ui.shadcn.com/) (Components)
- [Lucide Icons](https://lucide.dev/)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python API)
- [LangGraph](https://python.langchain.com/docs/langgraph/) (AI Agent Orchestration)
- [Google Gemini API](https://ai.google.dev/) (LLM)
- [Pinecone](https://www.pinecone.io/) (Vector Database)
- [Supabase](https://supabase.com/) (PostgreSQL & Authentication)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A Supabase project
- A Pinecone index
- A Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tonysunil/SchemePilot-AI.git
   cd SchemePilot-AI
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   *Create a `.env` file in the `backend` directory and add your `GEMINI_API_KEY`, `PINECONE_API_KEY`, and `PINECONE_ENV`.*

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env.local` file in the `frontend` directory and add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.*

### Running the App Locally

1. **Start the FastAPI Backend:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Start the Next.js Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## 🧠 AI Architecture

The backend utilizes **LangGraph** to create a stateful, cyclic reasoning engine. When a user asks a question, the `Router Node` classifies the intent into one of three distinct flows:
- `search`: Look up scheme information and determine user eligibility.
- `compare`: Generate structured markdown tables comparing the benefits of multiple schemes.
- `plan`: Extract application processes and generate step-by-step checklists.

The system uses **Retrieval-Augmented Generation (RAG)** via Pinecone to ensure the LLM never hallucinates and always grounds its answers in the official `schemes.json` database.

---
*Built with passion to make government welfare accessible to everyone.*
