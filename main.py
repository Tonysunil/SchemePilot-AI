import os
import sys

# Change the current working directory to 'backend' so that
# all relative paths (like "data/schemes.json") resolve correctly!
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
sys.path.insert(0, os.getcwd())

# Now import the actual FastAPI app from the backend folder
from main import app
