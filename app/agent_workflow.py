import json
import re
from typing import Dict, Any, List, Optional
from groq import Groq
from app.config import GROQ_API_KEY, WRITER_MODEL, REVIEWER_MODEL
from app.db import get_db_connection
from app.style_analyzer import get_user_style_profile
from app.linkedin_service import get_user_historic_posts

def get_few_shot_examples(user_id: int, topic: str, length: str, language: str) -> List[Dict[str, Any]]:
    """Selects top 2 most relevant historic posts of the user as few-shot examples."""
    posts = get_user_historic_posts(user_id)
    if not posts:
        return []

    # Prioritize matching language and similar line count
    matched = []
    for p in posts:
        score = 0
        if p.get("language", "").lower() == language.lower():
            score += 2
        # Topic keyword overlap
        p_tags = [t.lower() for t in p.get("tags", [])]
        if any(w.lower() in p["text"].lower() or any(w.lower() in t for t in p_tags) for w in topic.split()):
            score += 3
        # Length match
        line_cnt = p.get("line_count", 5)
        if length == "Short" and line_cnt <= 4:
            score += 2
        elif length == "Medium" and 5 <= line_cnt <= 10:
            score += 2
        elif length == "Long" and line_cnt > 10:
            score += 2
        matched.append((score, p))

    matched.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in matched[:2]]

def run_writer_agent(
    client: Groq,
    topic: str,
    length: str,
    language: str,
    style_profile: Dict[str, Any],
    few_shot_posts: List[Dict[str, Any]],
    attempt: int,
    previous_draft: str = "",
    reviewer_feedback: str = ""
) -> str:
    """Writer Agent: Generates or revises the LinkedIn post based on user style and feedback."""

    length_guidance = {
        "Short": "1 to 5 lines (approx 40-80 words). High impact, razor sharp.",
        "Medium": "6 to 10 lines (approx 120-180 words). Well-paced story or lesson.",
        "Long": "11 to 15 lines (approx 200-280 words). Deep dive with clear structure."
    }.get(length, "6 to 10 lines (120-180 words)")

    lang_guidance = "Write in natural English."
    if language.lower() == "hinglish":
        lang_guidance = (
            "Write in Hinglish (a natural, conversational blend of Hindi words written in English script + English). "
            "Make it sound relatable, authentic, and modern (e.g. using conversational phrases like 'yeh toh sach hai', 'funda simple hai', 'sapne dekhna achi baat hai'). "
            "Script MUST strictly use the English alphabet."
        )

    examples_block = ""
    if few_shot_posts:
        examples_block = "\n\n---\nHISTORIC POST SAMPLES FROM THIS CREATOR (MIMIC THIS EXACT STYLE & RHYTHM):\n"
        for i, ex in enumerate(few_shot_posts):
            examples_block += f"\nExample #{i+1} (Likes: {ex.get('engagement', 100)}):\n{ex.get('text', '')}\n"

    system_prompt = f"""You are an elite LinkedIn ghostwriter working for a creator with this specific Style Persona:
- Persona Name: {style_profile.get('persona_name', 'Thought Leader')}
- Tone: {style_profile.get('tone_summary', 'Authentic, direct, and conversational')}
- Hook Style: {style_profile.get('hook_style', 'Strong first line that creates tension or curiosity')}
- Structure Rules: {style_profile.get('structure_rules', '1-2 lines per paragraph with blank lines between')}
- Formatting Rules: {style_profile.get('formatting_rules', 'Clean layout, punchy sentences')}
- Emoji Strategy: {style_profile.get('emoji_strategy', 'Sparse, 1-2 warm emojis maximum')}
- Hashtag Strategy: {style_profile.get('hashtag_strategy', 'Do not use hashtags')}
- Ending CTA: {style_profile.get('call_to_action_style', 'Ends with an engaging question or sincere takeaway')}

RULES FOR THE POST:
1. Target Length: {length_guidance}
2. Language: {lang_guidance}
3. Stop the scroll with a killer first line (hook).
4. Deliver 1 clear, valuable, actionable takeaway.
5. Ensure mobile skimmability with generous whitespace (never more than 2 lines per paragraph).
6. Never sound like corporate buzzword AI. Sound like a real, authentic human.
7. No hashtags unless specifically mandated.
{examples_block}
"""

    if attempt == 1 or not reviewer_feedback:
        user_message = f"Write a LinkedIn post about this topic: '{topic}'."
    else:
        user_message = f"""Your previous draft on '{topic}' was REJECTED by the senior editorial reviewer.

PREVIOUS DRAFT:
{previous_draft}

REVIEWER'S FEEDBACK:
{reviewer_feedback}

INSTRUCTIONS FOR REVISION:
- Address EVERY single critique point mentioned by the reviewer above.
- Retain the creator's authentic persona and tone.
- Fix the hook, rhythm, length, or takeaway as requested.
- Do not repeat the same mistakes. Output only the improved post text.
"""

    response = client.chat.completions.create(
        model=WRITER_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7
    )

    draft = response.choices[0].message.content.strip()
    # Clean possible markdown wrapping like ```markdown ... ```
    if draft.startswith("```"):
        draft = re.sub(r"^```(?:markdown|text)?\n?", "", draft)
        draft = re.sub(r"\n?```$", "", draft)
    return draft.strip()

def run_reviewer_agent(
    client: Groq,
    draft: str,
    topic: str,
    length: str,
    language: str,
    style_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """Reviewer Agent: Evaluates the draft strictly against quality & virality criteria."""

    reviewer_prompt = f"""You are a strict, top-tier LinkedIn editorial director and quality assurance critic.
You judge whether a LinkedIn post draft is truly publish-ready for a creator whose persona is '{style_profile.get('persona_name', 'Creator')}'.

TARGET TOPIC: {topic}
TARGET LENGTH: {length}
TARGET LANGUAGE: {language}

DRAFT TO EVALUATE:
\"\"\"
{draft}
\"\"\"

Evaluate the post against these 7 strict criteria:
1. Hook Strength: Does the first line immediately hook the reader, evoke curiosity, or hit an emotional nerve?
2. Clear Value: Is there one distinct, non-generic takeaway?
3. Skimmability & Spacing: Are paragraphs short (1-2 sentences max) with clean blank line breaks?
4. Length & Pacing: Does it match the requested length ({length}) without dragging or feeling rushed?
5. Tone Match: Does it match the authentic, human tone without sounding like generic ChatGPT/AI fluff?
6. Ending Question / CTA: Does it conclude with a natural, engaging question or call-to-action that invites comments?
7. Hashtag / Formatting Discipline: Are there hashtags present when not wanted? (LinkedIn posts perform better with 0 hashtags).

Respond in EXACTLY this JSON format:
{{
  "verdict": "APPROVED" or "REJECTED",
  "score": <integer from 0 to 100>,
  "feedback": "<one concise paragraph explaining why it passed or exactly what must be fixed in the next draft>",
  "criteria_breakdown": {{
    "hook": true or false,
    "clear_value": true or false,
    "skimmability": true or false,
    "length_pacing": true or false,
    "tone_authenticity": true or false,
    "cta_ending": true or false,
    "formatting_discipline": true or false
  }}
}}

Be strict, rigorous, and constructive. Approve only if score >= 85 and all key criteria pass. Reject if the hook is weak, paragraphs are clumped together, or tone is robotic. Output ONLY JSON.
"""

    response = client.chat.completions.create(
        model=REVIEWER_MODEL,
        messages=[
            {"role": "system", "content": "You are a strict LinkedIn content critic. Output pure valid JSON only, without backticks or markdown fences."},
            {"role": "user", "content": reviewer_prompt}
        ],
        temperature=0.2
    )

    raw_content = response.choices[0].message.content.strip()
    if raw_content.startswith("```"):
        raw_content = re.sub(r"^```(?:json)?\n?", "", raw_content)
        raw_content = re.sub(r"\n?```$", "", raw_content)
    raw_content = raw_content.strip()

    try:
        review_data = json.loads(raw_content)
    except Exception:
        # Heuristic fallback if json parsing fails
        is_app = "APPROVED" in raw_content.upper()
        review_data = {
            "verdict": "APPROVED" if is_app else "REJECTED",
            "score": 88 if is_app else 72,
            "feedback": raw_content[:250],
            "criteria_breakdown": {
                "hook": True,
                "clear_value": True,
                "skimmability": True,
                "length_pacing": True,
                "tone_authenticity": True,
                "cta_ending": True,
                "formatting_discipline": True
            }
        }

    return review_data

def generate_post_with_agents(
    user_id: int,
    topic: str,
    length: str = "Medium",
    language: str = "English",
    max_attempts: int = 3
) -> Dict[str, Any]:
    """
    Executes the multi-agent generation and feedback loop:
    1. Context & Few-shot Agent
    2. Writer Agent (Drafting)
    3. Reviewer Agent (Reviewing)
    4. Feedback Loop Router (Iteration until APPROVED or max attempts)
    5. Saves result and returns full iteration trace.
    """
    client = Groq(api_key=GROQ_API_KEY)
    
    # 1. Fetch user's style profile and few-shot posts
    style_profile = get_user_style_profile(user_id)
    few_shot_posts = get_few_shot_examples(user_id, topic, length, language)

    attempts_trace = []
    current_draft = ""
    current_feedback = ""
    is_approved = False
    final_post = ""

    for attempt in range(1, max_attempts + 1):
        # 2. Writer Agent drafts/rewrites
        current_draft = run_writer_agent(
            client=client,
            topic=topic,
            length=length,
            language=language,
            style_profile=style_profile,
            few_shot_posts=few_shot_posts,
            attempt=attempt,
            previous_draft=current_draft,
            reviewer_feedback=current_feedback
        )

        # 3. Reviewer Agent critiques
        review_result = run_reviewer_agent(
            client=client,
            draft=current_draft,
            topic=topic,
            length=length,
            language=language,
            style_profile=style_profile
        )

        verdict = review_result.get("verdict", "REJECTED").upper()
        score = review_result.get("score", 75)
        current_feedback = review_result.get("feedback", "")
        criteria = review_result.get("criteria_breakdown", {})
        is_approved = (verdict == "APPROVED")

        step_record = {
            "attempt": attempt,
            "draft": current_draft,
            "verdict": verdict,
            "score": score,
            "feedback": current_feedback,
            "criteria_breakdown": criteria
        }
        attempts_trace.append(step_record)

        # 4. Feedback Loop Router
        if is_approved:
            final_post = current_draft
            break
        else:
            final_post = current_draft  # Keep latest draft in case max attempts reached

    # Save into generated_posts table
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO generated_posts (
            user_id, topic, length, language, initial_draft, final_post,
            is_approved, attempts, review_feedback, trace_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        topic,
        length,
        language,
        attempts_trace[0]["draft"] if attempts_trace else current_draft,
        final_post,
        1 if is_approved else 0,
        len(attempts_trace),
        current_feedback,
        json.dumps(attempts_trace)
    ))
    post_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": post_id,
        "topic": topic,
        "length": length,
        "language": language,
        "final_post": final_post,
        "is_approved": is_approved,
        "total_attempts": len(attempts_trace),
        "review_feedback": current_feedback,
        "style_persona": style_profile.get("persona_name", ""),
        "trace": attempts_trace
    }

def revise_post_with_user_feedback(
    post_id: int,
    user_id: int,
    user_feedback: str
) -> Dict[str, Any]:
    """
    Human-in-the-loop refinement:
    Accepts user's custom feedback, updates the post via the Writer Agent,
    re-runs the Reviewer Agent, and appends the new iteration step to the trace.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM generated_posts WHERE id = ? AND user_id = ?", (post_id, user_id))
    post_row = cursor.fetchone()
    
    if not post_row:
        conn.close()
        raise ValueError("Post not found.")

    post_data = dict(post_row)
    try:
        trace = json.loads(post_data.get("trace_json", "[]"))
    except Exception:
        trace = []

    client = Groq(api_key=GROQ_API_KEY)
    style_profile = get_user_style_profile(user_id)
    topic = post_data["topic"]
    length = post_data.get("length", "Medium")
    language = post_data.get("language", "English")
    previous_draft = post_data["final_post"]
    few_shot_posts = get_few_shot_examples(user_id, topic, length, language)

    next_attempt = len(trace) + 1
    combined_feedback = f"User Feedback: '{user_feedback}'. Please adjust the draft accordingly."

    new_draft = run_writer_agent(
        client=client,
        topic=topic,
        length=length,
        language=language,
        style_profile=style_profile,
        few_shot_posts=few_shot_posts,
        attempt=next_attempt,
        previous_draft=previous_draft,
        reviewer_feedback=combined_feedback
    )

    review_result = run_reviewer_agent(
        client=client,
        draft=new_draft,
        topic=topic,
        length=length,
        language=language,
        style_profile=style_profile
    )

    verdict = review_result.get("verdict", "APPROVED").upper()
    score = review_result.get("score", 90)
    critique = review_result.get("feedback", "")
    is_approved = (verdict == "APPROVED")

    step_record = {
        "attempt": next_attempt,
        "is_human_refinement": True,
        "user_feedback": user_feedback,
        "draft": new_draft,
        "verdict": verdict,
        "score": score,
        "feedback": critique,
        "criteria_breakdown": review_result.get("criteria_breakdown", {})
    }
    trace.append(step_record)

    cursor.execute("""
        UPDATE generated_posts
        SET final_post = ?, is_approved = ?, attempts = ?, review_feedback = ?, trace_json = ?
        WHERE id = ?
    """, (
        new_draft,
        1 if is_approved else 0,
        len(trace),
        critique,
        json.dumps(trace),
        post_id
    ))
    conn.commit()
    conn.close()

    return {
        "id": post_id,
        "topic": topic,
        "final_post": new_draft,
        "is_approved": is_approved,
        "total_attempts": len(trace),
        "review_feedback": critique,
        "trace": trace
    }
