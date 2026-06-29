import os
import json
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "schemepilot-schemes"

def seed_database():
    print("Initializing Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Check if index exists, else create
    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
    if INDEX_NAME in existing_indexes:
        print(f"Deleting old Pinecone index '{INDEX_NAME}'...")
        pc.delete_index(INDEX_NAME)
        
    print(f"Creating Pinecone index '{INDEX_NAME}' with dimension 3072...")
    pc.create_index(
        name=INDEX_NAME,
        dimension=3072, # gemini-embedding-2 dimension
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    while not pc.describe_index(INDEX_NAME).status['ready']:
        time.sleep(1)
        print("Waiting for index to be ready...")
    
    print("Index is ready!")

    # Load schemes data
    schemes_path = os.path.join("data", "schemes.json")
    with open(schemes_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        schemes = data.get("schemes", data) if isinstance(data, dict) else data

    documents = []
    for s in schemes:
        # Create a rich text representation for embedding
        text = f"Scheme Name: {s.get('name', '')}\n"
        text += f"Category: {s.get('category', '')}\n"
        text += f"Description: {s.get('description', '')}\n"
        
        text += f"Eligibility: {s.get('eligibility', 'Any')}\n"
        text += f"State: {s.get('state', 'Any')}\n"
        text += f"Income Limit: {s.get('income_limit', 'None')}\n"
        text += f"Benefits: {s.get('benefits', '')}\n"
        text += f"Required Documents: {', '.join(s.get('required_documents', []))}\n"
        
        # Clean metadata (Pinecone does not accept null values)
        metadata = {k: (v if v is not None else "None") for k, v in s.items()}
        # Ensure lists are lists of strings
        if 'required_documents' in metadata and isinstance(metadata['required_documents'], list):
            metadata['required_documents'] = [str(x) for x in metadata['required_documents']]
        
        doc = Document(page_content=text, metadata=metadata)
        documents.append(doc)

    print(f"Loaded {len(documents)} schemes. Generating embeddings...")

    # Initialize Embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")

    # Upload to Pinecone
    PineconeVectorStore.from_documents(
        documents,
        embeddings,
        index_name=INDEX_NAME
    )
    
    print("Successfully seeded Pinecone vector database!")

if __name__ == "__main__":
    seed_database()
