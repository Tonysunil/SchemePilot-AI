import json
import os
import time
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import base64

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from typing import TypedDict, List, Dict, Any

load_dotenv()

app = FastAPI(title="SchemePilot AI Backend - LangGraph Edition", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock RAG data
SCHEMES_DB_PATH = os.path.join("data", "schemes.json")
try:
    with open(SCHEMES_DB_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        if isinstance(data, dict) and "schemes" in data:
            schemes_db = data["schemes"]
        else:
            schemes_db = data
except FileNotFoundError:
    schemes_db = []

class ChatRequest(BaseModel):
    message: str
    history: list = []
    user_profile: dict = {}
    language: str = "en"

# --- LangGraph State & Nodes ---
class AgentState(TypedDict):
    input: str
    history: List[Dict[str, Any]]
    intent: str
    profile: Dict[str, Any]
    user_profile: Dict[str, Any]
    schemes: List[Dict[str, Any]]
    final_response: str
    language: str

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

def router_node(state: AgentState):
    hist_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('history', [])[-3:]])
    prompt = f"""Analyze the user query and determine the intent.
    Choose exactly ONE intent from: ['compare', 'plan', 'search'].
    Recent Context: {hist_str}
    Query: {state['input']}
    Intent:"""
    response = llm.invoke([HumanMessage(content=prompt)])
    intent = response.content.strip().lower()
    if 'compare' in intent:
        return {"intent": "compare"}
    elif 'plan' in intent or 'how to apply' in state['input'].lower():
        return {"intent": "plan"}
    return {"intent": "search"}

def profile_extractor_node(state: AgentState):
    prompt = f"""Extract age, occupation, and state from the query if present. Output as JSON.
    Query: {state['input']}"""
    try:
        response = llm.invoke([SystemMessage(content="Output ONLY valid JSON: {\"age\": null, \"occupation\": null, \"state\": null}"), HumanMessage(content=prompt)])
        import re
        match = re.search(r'\{.*\}', response.content.replace('\n', ''), re.IGNORECASE)
        if match:
            profile = json.loads(match.group())
        else:
            profile = {"age": None, "occupation": None, "state": None}
    except:
        profile = {"age": None, "occupation": None, "state": None}
    return {"profile": profile}

def search_node(state: AgentState):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    vectorstore = PineconeVectorStore(index_name="schemepilot-schemes", embedding=embeddings)
    docs = vectorstore.similarity_search(state['input'], k=3)
    context = "\n\n".join([doc.page_content for doc in docs])

    profile_ctx = ""
    if state.get("user_profile"):
        profile_ctx = f"CRITICAL: The user has a saved profile. Use these details strictly to evaluate eligibility. DO NOT ask them for this information again:\n{json.dumps(state['user_profile'], indent=2)}\n"

    lang_ctx = f"CRITICAL RULE: You MUST reply entirely in the language corresponding to this language code: '{state.get('language', 'en')}'. Do not use English unless the code is 'en'."

    hist_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('history', [])[-4:]])
    prompt = f"""You are SchemePilot AI. 
    Conversation History:
    {hist_str}
    
    The user asked: {state['input']}. 
    {profile_ctx}
    {lang_ctx}
    Use the following relevant schemes data to answer their question clearly and concisely. Format nicely with markdown. Tell them explicitly if they are eligible based on their profile.
    Data: {context}"""
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_response": response.content}

def compare_node(state: AgentState):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    vectorstore = PineconeVectorStore(index_name="schemepilot-schemes", embedding=embeddings)
    docs = vectorstore.similarity_search(state['input'], k=4)
    context = "\n\n".join([doc.page_content for doc in docs])

    lang_ctx = f"CRITICAL RULE: You MUST reply entirely in the language corresponding to this language code: '{state.get('language', 'en')}'. Do not use English unless the code is 'en'."

    hist_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('history', [])[-4:]])
    prompt = f"""You are SchemePilot AI. 
    Conversation History:
    {hist_str}
    
    The user asked to compare schemes: {state['input']}.
    {lang_ctx}
    Use the following relevant data to create a detailed Markdown comparison table.
    Data: {context}"""
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_response": response.content}

def plan_node(state: AgentState):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    vectorstore = PineconeVectorStore(index_name="schemepilot-schemes", embedding=embeddings)
    docs = vectorstore.similarity_search(state['input'], k=2)
    context = "\n\n".join([doc.page_content for doc in docs])

    lang_ctx = f"CRITICAL RULE: You MUST reply entirely in the language corresponding to this language code: '{state.get('language', 'en')}'. Do not use English unless the code is 'en'."

    hist_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('history', [])[-4:]])
    prompt = f"""You are SchemePilot AI. 
    Conversation History:
    {hist_str}
    
    The user asked how to apply for a scheme: {state['input']}.
    {lang_ctx}
    Provide a step-by-step markdown checklist with estimated timelines based on typical Indian government processes using the provided context.
    Data: {context}"""
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_response": response.content}

# Build Graph
workflow = StateGraph(AgentState)
workflow.add_node("router", router_node)
workflow.add_node("extractor", profile_extractor_node)
workflow.add_node("search", search_node)
workflow.add_node("compare", compare_node)
workflow.add_node("plan", plan_node)

workflow.set_entry_point("router")
workflow.add_edge("router", "extractor")

def route_intent(state: AgentState):
    if state["intent"] == "compare":
        return "compare"
    elif state["intent"] == "plan":
        return "plan"
    return "search"

workflow.add_conditional_edges("extractor", route_intent, {
    "compare": "compare",
    "plan": "plan",
    "search": "search"
})

workflow.add_edge("compare", END)
workflow.add_edge("plan", END)
workflow.add_edge("search", END)

app_graph = workflow.compile()

@app.get("/api/v1/schemes")
async def get_schemes():
    return schemes_db

@app.post("/api/v1/chat")
async def chat_endpoint(req: ChatRequest):
    if not os.getenv("GEMINI_API_KEY"):
        return {"reply": "Error: GEMINI_API_KEY is missing from backend env.", "profile_extracted": {}}
        
    initial_state = {
        "input": req.message, 
        "history": req.history,
        "intent": "", 
        "profile": {}, 
        "user_profile": req.user_profile,
        "schemes": [], 
        "final_response": "",
        "language": req.language
    }
    
    try:
        final_state = app_graph.invoke(initial_state)
        return {
            "reply": final_state["final_response"],
            "profile_extracted": final_state.get("profile", {})
        }
    except Exception as e:
        return {"reply": f"Error during AI processing: {str(e)}", "profile_extracted": {}}

@app.post("/api/v1/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        b64_data = base64.b64encode(contents).decode("utf-8")
        
        mime_type = file.content_type
        if not mime_type:
            if file.filename.lower().endswith(".pdf"):
                mime_type = "application/pdf"
            else:
                mime_type = "image/jpeg"

        prompt = """Act as a strict Indian Government Document Verification Agent.
        Analyze this document and extract key data. 
        Output MUST be ONLY valid JSON matching this schema exactly:
        {
          "status": "success" or "error",
          "document_type": "Name of the document (e.g., Aadhaar Card, Income Certificate, Student ID)",
          "extracted_data": { 
             "key_field": "value" 
          },
          "validation": "A brief sentence explaining if the document looks valid and what was found."
        }"""
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{b64_data}"}}
            ]
        )
        
        response = llm.invoke([message])
        
        import re
        match = re.search(r'\{.*\}', response.content.replace('\n', ' '), re.IGNORECASE)
        if match:
            return json.loads(match.group())
        else:
            # Fallback if regex fails to find JSON
            clean_text = response.content.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            return json.loads(clean_text)
            
    except Exception as e:
        print("OCR Error:", str(e))
        return {"status": "error", "document_type": "Processing Error", "extracted_data": {}, "validation": f"Failed to process document: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
