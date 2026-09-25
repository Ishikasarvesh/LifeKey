"""
LIFEKEY — Backend Runner
Launches the FastAPI application on http://127.0.0.1:8000 with auto-reload.
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
