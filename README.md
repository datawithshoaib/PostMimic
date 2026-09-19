# PostMimic - LinkedIn Style Cloner & Multi-Agent Studio

**PostMimic** is an end-to-end web application that connects to a user's LinkedIn profile, extracts 10–15 historic posts, analyzes their distinct writing style DNA, and uses an autonomous **multi-agent feedback loop** (Writer Agent + Reviewer Critic Agent + Loop Controller) to draft and iteratively polish publish-ready LinkedIn posts.

---

## 🌟 Key Features

1. **User Authentication & Profiles**:
   - Secure login & registration with PBKDF2-HMAC-SHA256 password hashing.
   - **1-Click Demo Login** pre-loaded with Mohan Sharma's 10 viral LinkedIn posts and trained Style Persona.
   - Profile management: Custom avatar, headline, bio, follower count, and vanity URL.

2. **LinkedIn Connection & Historic Posts Extraction**:
   - Extracts 10 to 15 historic posts via profile URL, custom paste, or influencer presets (*Mohan Sharma - Tech Educator*, *Sarah Chen - AI Founder*, *Arjun Mehta - Growth Strategist*).
   - Shows engagement reactions (👍, ❤️, 👏), line count, detected language (English / Hinglish), and topic tags.

3. **Writing Style DNA & Persona Cloner**:
   - Deep LLM-powered style analysis extracting:
     - **Persona Archetype**: Title, tone nuances, and voice traits.
     - **Hook Formula**: First-line pattern that stops the scroll.
     - **Structure & Whitespace Anatomy**: Paragraph spacing, average line count, mobile skimmability.
     - **Visual Discipline**: Emoji placement and hashtag policy.
     - **Ending CTA**: Conversion and comment-sparking questions.

4. **Multi-Agent Workflow with Iterative Feedback Loop (`PostDraft` Integration)**:
   - **Agent 1 (Persona & Few-Shot Agent)**: Injects creator's Style DNA and retrieves the top 2 matching historic posts.
   - **Agent 2 (Writer Agent)**: Drafts the post matching the creator's exact style. On revision attempts, systematically addresses every critique from the reviewer.
   - **Agent 3 (Reviewer Agent)**: Rigorous editorial critic evaluating hook strength, takeaway value, line spacing, length, authenticity, and CTA. Outputs `VERDICT: APPROVED | REJECTED`, score, and actionable feedback.
   - **Feedback Loop Controller**: If rejected, routes back to Writer Agent with specific critique; loops up to 3 attempts until approved.
   - **Interactive Step-by-Step Trace**: Tabbed visual stepper displaying Draft 1, Reviewer Critique, and Revision Draft 2.

5. **Human-in-the-Loop Refinement**:
   - Users can provide custom instructions (*"Make the hook punchier"*, *"Add an anecdote"*) to trigger immediate agent revisions.

6. **Authentic LinkedIn Live Preview**:
   - Realistic replica of LinkedIn mobile/desktop feed card with author header, timestamp, formatted post body, and engagement buttons.
   - One-click copy with preserved formatting, export to TXT/Markdown, and draft history saving.

---

## 🚀 Quick Start

### 1. Requirements & Environment
Ensure your `.env` contains your `GROQ_API_KEY`:
```env
GROQ_API_KEY=gsk_your_groq_api_key
```

### 2. Launching the Web Application
Run the launcher script using Python:
```bash
python run.py
```
*Or double click `start.bat` on Windows.*

The app will start at:
👉 **http://localhost:8080**  
*(API documentation available at http://localhost:8080/docs)*

---

## 🏗️ Architecture

```
PostMimic/
├── app/
│   ├── config.py             # App configuration and model settings
│   ├── db.py                 # SQLite database and schema migrations
│   ├── auth.py               # User sessions and PBKDF2 password security
│   ├── linkedin_service.py   # LinkedIn post extractor and influencer presets
│   ├── style_analyzer.py     # LLM style decomposition & persona cloner
│   ├── agent_workflow.py     # Multi-agent feedback loop (Writer + Reviewer + Controller)
│   └── main.py               # FastAPI REST API endpoints & React SPA serving
├── frontend/                 # Modern React 18 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── api/client.js     # Unified typed API client
│   │   ├── components/
│   │   │   ├── studio/       # Agent Studio, Controls, Pipeline trace, LinkedIn Preview
│   │   │   ├── historic/     # Historic posts grid, filters, and add post modal
│   │   │   ├── style/        # Style DNA persona inspection cards
│   │   │   ├── drafts/       # Saved drafts & history archive
│   │   │   └── modals/       # Auth, LinkedIn presets, and Profile modals
│   │   ├── App.jsx           # Main React root application
│   │   └── index.css         # Tailwind & custom LinkedIn feed styles
│   ├── dist/                 # Production compiled bundle (served by FastAPI)
│   ├── package.json          # Frontend dependencies & build scripts
│   └── vite.config.js        # Vite build & development proxy configuration
├── run.py                    # Server launcher & auto-browser opener
├── server.py                 # Uvicorn FastAPI runner
├── postmimic.db              # SQLite database (auto-created)
└── requirements.txt          # Python dependencies
```

---

## 🧪 Testing the API

Run the automated integration test suite:
```bash
python -c "
from starlette.testclient import TestClient
from app.main import app
client = TestClient(app)
print(client.get('/health').json())
"
```
