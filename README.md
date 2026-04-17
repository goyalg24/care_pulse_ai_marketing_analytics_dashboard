# AI Assistant Service

This is a prototype service for **ai/ml portion** of the CarePulse AI Marketing Analytics Dashboard project.

It focuses on the **AI/ML layer**:
- AI assistant API for dashboard questions
- tool registry and dynamic tool discovery pattern
- analytics summary generation
- campaign recommendations
- conversation logging
- optional LLM integration through an environment variable

## What this includes
- FastAPI backend service
- MCP-style tool registry pattern
- mock analytics tools for campaign and segment insights
- optional OpenAI-backed response generation if `OPENAI_API_KEY` is provided
- works in **mock mode** even without an API key

## Project structure

```text
app/
  main.py
  assistant.py
  tools.py
  models.py
requirements.txt
.env.example
run.sh
```

## 1. Create and activate a virtual environment

### macOS / Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows PowerShell
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

## 2. Install dependencies
```bash
pip install -r requirements.txt
```

## 3. Set environment variables
Copy `.env.example` to `.env`.

### macOS / Linux
```bash
cp .env.example .env
```

### Windows PowerShell
```powershell
copy .env.example .env
```

If you have an OpenAI API key, place it in `.env`.
If not, the app still runs in mock mode.

## 4. Run the app
```bash
bash run.sh
```

Or directly:
```bash
uvicorn app.main:app --reload
```

## 5. Open the API docs
Visit:
```text
http://127.0.0.1:8000/docs
```

## Available endpoints
- `GET /health` - service health
- `GET /tools` - list available tools
- `POST /ask` - ask the assistant a question
- `GET /campaigns` - sample campaign data
- `GET /segments` - sample customer segments
- `GET /conversations` - view saved chat history

## Example question to test
Use this JSON in `/ask`:

```json
{
  "user_id": 1,
  "question": "Summarize campaign performance and recommend which segment to prioritize next.",
  "use_live_llm": false
}
```

## Notes
- This is ai/ml api part only.
- The other team members can connect this service to the main frontend and broader backend later.
- In a full final project, this service can be integrated with FastMCP, LangGraph workflows, a database, and dashboard APIs.
