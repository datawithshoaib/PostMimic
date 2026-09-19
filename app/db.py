import sqlite3
import json
from pathlib import Path
from datetime import datetime, timedelta
from app.config import DB_PATH, BASE_DIR

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema and seeds initial data if needed."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        headline TEXT,
        avatar_url TEXT,
        linkedin_url TEXT,
        follower_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # Historic posts table (10 to 15 posts per user)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS historic_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        engagement INTEGER DEFAULT 0,
        line_count INTEGER DEFAULT 1,
        language TEXT DEFAULT 'English',
        tags TEXT DEFAULT '[]',
        source TEXT DEFAULT 'linkedin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # Style profiles table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS style_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        persona_name TEXT,
        tone_summary TEXT,
        hook_style TEXT,
        structure_rules TEXT,
        formatting_rules TEXT,
        emoji_strategy TEXT,
        hashtag_strategy TEXT,
        call_to_action_style TEXT,
        avg_line_count REAL DEFAULT 6.0,
        top_themes TEXT DEFAULT '[]',
        raw_profile_json TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    # Generated posts table (with multi-agent feedback loop trace)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS generated_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        topic TEXT NOT NULL,
        length TEXT,
        language TEXT,
        initial_draft TEXT,
        final_post TEXT,
        is_approved BOOLEAN DEFAULT 0,
        attempts INTEGER DEFAULT 1,
        review_feedback TEXT,
        trace_json TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()

    # Seed demo user & historic posts if not present
    seed_demo_data()

def seed_demo_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email = ?", ("mohan@codebasics.io",))
    existing = cursor.fetchone()

    if not existing:
        from app.auth import hash_password
        pwd_hash = hash_password("password123")
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, headline, avatar_url, linkedin_url, follower_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            "mohan@codebasics.io",
            pwd_hash,
            "Mohan Sharma",
            "Tech Educator | 150K+ LinkedIn | Founder @ Codebasics | Helping Developers Grow",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            "https://linkedin.com/in/mohan-codebasics",
            152000
        ))
        user_id = cursor.lastrowid
        conn.commit()
    else:
        user_id = existing["id"]

    cursor.execute("SELECT count(*) FROM historic_posts WHERE user_id = ?", (user_id,))
    hp_count = cursor.fetchone()[0]

    if hp_count == 0:

        # Seed 10-15 historic posts from data/processed_posts.json or data/raw_posts.json
        processed_file = BASE_DIR / "data" / "processed_posts.json"
        raw_file = BASE_DIR / "data" / "raw_posts.json"

        posts_to_insert = []
        if processed_file.exists():
            try:
                with open(processed_file, "r", encoding="utf-8") as f:
                    posts = json.load(f)
                    posts_to_insert = posts[:15]
            except Exception as e:
                print(f"Error loading processed posts: {e}")

        if not posts_to_insert and raw_file.exists():
            try:
                with open(raw_file, "r", encoding="utf-8") as f:
                    posts = json.load(f)
                    posts_to_insert = posts[:15]
            except Exception as e:
                print(f"Error loading raw posts: {e}")

        for p in posts_to_insert:
            text = p.get("text", "")
            # Sanitize any unpaired surrogates (e.g. \ud83e without trail)
            if isinstance(text, str):
                text = text.encode("utf-16", "surrogatepass").decode("utf-16", "ignore")
                text = text.encode("utf-8", "ignore").decode("utf-8")
            engagement = p.get("engagement", 100)
            line_count = p.get("line_count", len([l for l in text.split("\n") if l.strip()]))
            language = p.get("language", "English")
            tags = p.get("tags", ["Career", "Job Search"])
            if isinstance(tags, list):
                tags_json = json.dumps(tags)
            else:
                tags_json = json.dumps([str(tags)])

            cursor.execute("""
                INSERT INTO historic_posts (user_id, text, engagement, line_count, language, tags, source)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user_id, text, engagement, line_count, language, tags_json, "linkedin"))

        # Seed default Mohan Style Profile
        style_dna = {
            "persona_name": "Empathetic Realist & Career Coach",
            "tone_summary": "Vulnerable, brutally honest, empathetic, conversational, anti-corporate buzzwords.",
            "hook_style": "Short punchy observation or relatable pain point (e.g., 'Jobseekers, this one’s for you' or 'Looking for jobs on LinkedIn is like...')",
            "structure_rules": "1-2 lines per paragraph. Generous blank line breaks. High skimmability. Around 120-180 words.",
            "formatting_rules": "Clean layout, rare bullet points, no complex jargon. Uses simple punctuation.",
            "emoji_strategy": "Sparse and intentional. 1-2 warm emojis maximum (e.g. 🌻, 💔, 🙏).",
            "hashtag_strategy": "Zero hashtags. Let the content and authentic hook drive organic engagement.",
            "call_to_action_style": "Ends with a heartfelt encouragement or an open, introspective question.",
            "avg_line_count": 6.8,
            "top_themes": ["Job Search", "Mental Health", "Career Reality", "Self Worth", "Influencer Scams"]
        }

        cursor.execute("""
            INSERT OR REPLACE INTO style_profiles 
            (user_id, persona_name, tone_summary, hook_style, structure_rules, formatting_rules, 
             emoji_strategy, hashtag_strategy, call_to_action_style, avg_line_count, top_themes, raw_profile_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            style_dna["persona_name"],
            style_dna["tone_summary"],
            style_dna["hook_style"],
            style_dna["structure_rules"],
            style_dna["formatting_rules"],
            style_dna["emoji_strategy"],
            style_dna["hashtag_strategy"],
            style_dna["call_to_action_style"],
            style_dna["avg_line_count"],
            json.dumps(style_dna["top_themes"]),
            json.dumps(style_dna)
        ))

        conn.commit()

    conn.close()
