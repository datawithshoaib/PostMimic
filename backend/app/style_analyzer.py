import json
import os
import re
from typing import Dict, Any, List
from groq import Groq
from app.config import GROQ_API_KEY, STYLE_ANALYZER_MODEL
from app.db import get_db_connection
from app.linkedin_service import get_user_historic_posts

def analyze_user_style(user_id: int) -> Dict[str, Any]:
    """
    Analyzes the user's 10-15 historic posts using Groq LLM to extract
    their unique writing style DNA, hook formulas, tone, structure, and persona.
    """
    posts = get_user_historic_posts(user_id)
    if not posts:
        raise ValueError("No historic posts found for this user. Please extract or import 10-15 posts first.")

    posts_sample = "\n\n---\n\n".join([
        f"Post #{i+1} (Likes: {p['engagement']}, Language: {p['language']}):\n{p['text']}"
        for i, p in enumerate(posts[:15])
    ])

    prompt = f"""
You are a world-class ghostwriter and LinkedIn style profiler.
Analyze the following 10 to 15 historic LinkedIn posts from a specific creator and extract their exact writing DNA.

{posts_sample}

Provide a deep, rigorous breakdown formatted as a pure valid JSON object with EXACTLY these keys:
{{
  "persona_name": "A 3-5 word memorable title for their creator persona (e.g. 'Empathetic Realist & Career Coach')",
  "tone_summary": "Detailed 2-3 sentence description of their tone (vulnerability, humor, candor, authority, etc.)",
  "hook_style": "Specific explanation of how they start their posts to grab attention (first line formula, curiosity gaps, etc.)",
  "structure_rules": "Exact rules for how paragraphs, line breaks, and flow are constructed (e.g., '1-2 lines per paragraph, generous white space, 120-180 words')",
  "formatting_rules": "Rules on bullet points, capitalization, punchy one-liners, and typography",
  "emoji_strategy": "Exactly how and where emojis are used (e.g. 'Sparse, only 1-2 warm emojis like 🌻 or 🙏 at the end')",
  "hashtag_strategy": "Hashtag policy (e.g. 'Zero hashtags to maximize organic reach' or '2-3 niche tags at the bottom')",
  "call_to_action_style": "How they finish posts (e.g. 'Engaging open question inviting debate or comforting parting thought')",
  "avg_line_count": 7.0,
  "top_themes": ["Array", "of", "4-6", "core", "topics"],
  "signature_phrases": ["2-4 signature phrases or rhetorical structures they often employ"],
  "language_blend": "Explanation of English / Hinglish or colloquial balance"
}}

Output ONLY the JSON object. Do not include markdown code block backticks, preamble, or explanations.
"""

    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(
        model=STYLE_ANALYZER_MODEL,
        messages=[
            {"role": "system", "content": "You are a master LinkedIn writing style analyst. Always respond in strict, valid JSON without code blocks or backticks."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    raw_content = response.choices[0].message.content.strip()
    # Clean possible markdown ```json ... ```
    if raw_content.startswith("```"):
        raw_content = re.sub(r"^```(?:json)?\n?", "", raw_content)
        raw_content = re.sub(r"\n?```$", "", raw_content)
    raw_content = raw_content.strip()

    try:
        style_dna = json.loads(raw_content)
    except Exception as e:
        # Fallback heuristic extraction if json parsing fails
        style_dna = {
            "persona_name": "Authentic Industry Thought Leader",
            "tone_summary": "Conversational, direct, authentic, and focused on real-world practical insights.",
            "hook_style": "Strong opening one-liner highlighting a common misconception or relatable challenge.",
            "structure_rules": "Short paragraphs of 1-2 lines with blank line separators for maximum mobile readability.",
            "formatting_rules": "Clean minimal styling, punchy sentence rhythms, and clear takeaways.",
            "emoji_strategy": "Minimal, targeted usage (1-2 relevant emojis).",
            "hashtag_strategy": "Zero hashtags for cleaner aesthetic and direct conversational engagement.",
            "call_to_action_style": "Ends with an open question prompting the community to share their perspective.",
            "avg_line_count": 6.5,
            "top_themes": ["Career Growth", "Industry Insights", "Mindset", "Leadership"],
            "signature_phrases": ["Here is the truth...", "Remember this:"],
            "language_blend": "Clean professional English with conversational warmth"
        }

    # Save into database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO style_profiles 
        (user_id, persona_name, tone_summary, hook_style, structure_rules, formatting_rules,
         emoji_strategy, hashtag_strategy, call_to_action_style, avg_line_count, top_themes, raw_profile_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (
        user_id,
        style_dna.get("persona_name", "Creator Persona"),
        style_dna.get("tone_summary", ""),
        style_dna.get("hook_style", ""),
        style_dna.get("structure_rules", ""),
        style_dna.get("formatting_rules", ""),
        style_dna.get("emoji_strategy", ""),
        style_dna.get("hashtag_strategy", ""),
        style_dna.get("call_to_action_style", ""),
        float(style_dna.get("avg_line_count", 6.0)),
        json.dumps(style_dna.get("top_themes", [])),
        json.dumps(style_dna)
    ))
    conn.commit()
    conn.close()

    return style_dna

def get_user_style_profile(user_id: int) -> Dict[str, Any]:
    """Retrieves the style profile for a given user or triggers analysis if none exists."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT persona_name, tone_summary, hook_style, structure_rules, formatting_rules,
               emoji_strategy, hashtag_strategy, call_to_action_style, avg_line_count,
               top_themes, raw_profile_json, updated_at
        FROM style_profiles
        WHERE user_id = ?
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        # Check if historic posts exist, if so analyze them
        posts = get_user_historic_posts(user_id)
        if posts:
            return analyze_user_style(user_id)
        return {
            "persona_name": "Emerging Creator",
            "tone_summary": "Authentic and professional.",
            "hook_style": "Direct hook in the first line.",
            "structure_rules": "1-2 lines per paragraph with blank lines.",
            "formatting_rules": "Clean spacing.",
            "emoji_strategy": "1-2 emojis.",
            "hashtag_strategy": "No hashtags.",
            "call_to_action_style": "Engaging question at the end.",
            "avg_line_count": 6.0,
            "top_themes": ["Growth", "Insights"],
            "raw_profile_json": "{}"
        }

    res = dict(row)
    try:
        res["top_themes"] = json.loads(res["top_themes"])
    except Exception:
        res["top_themes"] = []
    try:
        res["details"] = json.loads(res["raw_profile_json"])
    except Exception:
        res["details"] = {}
    return res
