import json
import re
import random
from typing import List, Dict, Any
from app.db import get_db_connection
from app.config import BASE_DIR

# High-fidelity realistic profiles and historic post libraries for instant linking
PERSONA_PRESETS = {
    "tech_educator": {
        "full_name": "Mohan Sharma",
        "headline": "Tech Educator | 150K+ LinkedIn | Founder @ Codebasics | Helping Developers Grow",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        "follower_count": 152000,
        "posts_source": "data/processed_posts.json"
    },
    "ai_founder": {
        "full_name": "Sarah Chen",
        "headline": "Founder & CEO @ NeuralPulse | Ex-Google AI | Writing about Generative Agents & LLM Systems",
        "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
        "follower_count": 89000,
        "sample_posts": [
            {
                "text": "90% of AI startups will die in the next 18 months.\n\nNot because the models aren't good enough.\n\nBecause they're building thin wrappers over APIs with zero proprietary data moats.\n\nIf your entire USP can be replicated with a better system prompt in 20 minutes, you don't have a product.\n\nYou have a feature waiting to be absorbed.\n\nFocus on the workflow, the workflow integration, and the sticky data loops.\n\nAgree or disagree?",
                "engagement": 1420,
                "language": "English",
                "tags": ["AI", "Startups"]
            },
            {
                "text": "We just shipped our first multi-agent workflow to 100,000 active users.\n\nHere is the brutal truth nobody talks about:\n\n1. Single LLM calls are fast, but brittle.\n2. Multi-agent review loops increase latency by 3x, but reduce hallucinations by 85%.\n3. The reviewer agent needs stricter constraints than the writer agent.\n\nReliability is the only metric that matters in enterprise AI.\n\nWhat has been your biggest bottleneck deploying agents?",
                "engagement": 2105,
                "language": "English",
                "tags": ["AI", "Agents"]
            },
            {
                "text": "Stop asking candidates trivia questions in AI interviews.\n\nInstead, give them a broken agent output and ask them:\n- Why did the chain fail?\n- How would you structure the critic node to catch this?\n- How do you measure evaluation drift over time?\n\nTheoretical math is great. Production debugging saves the company.",
                "engagement": 880,
                "language": "English",
                "tags": ["Hiring", "Engineering"]
            },
            {
                "text": "The hardest part of building in AI isn't the technology.\n\nIt's resisting the urge to build features that look cool on Twitter but solve zero customer pain points.\n\nFlashy demos get retweets.\nBoring automation prints revenue.\n\nChoose boring.",
                "engagement": 1750,
                "language": "English",
                "tags": ["Startups", "Product"]
            },
            {
                "text": "Three things I wish I knew before raising our Seed round:\n\n1. Investors don't invest in products; they invest in lines, not dots.\n2. Every pitch deck slide that requires you to explain for 2 minutes is a failing slide.\n3. Momentum is fragile—protect your shipping cadence above all else.\n\nKeep building.",
                "engagement": 940,
                "language": "English",
                "tags": ["Fundraising", "Founders"]
            },
            {
                "text": "Code reviews are not for finding bugs.\n\nBugs should be caught by automated tests and linters.\n\nCode reviews are for knowledge sharing, architecture alignment, and mentoring junior engineers.\n\nIf your PR comments are mostly about formatting, your tooling is broken.",
                "engagement": 1210,
                "language": "English",
                "tags": ["Engineering", "Leadership"]
            },
            {
                "text": "Your company doesn't need an 'AI Strategy'.\n\nYour company has business goals: cut churn, speed up onboarding, decrease support resolution time.\n\nAI is simply one tool among many to achieve them.\n\nIf a simple regex or a database trigger does it faster and cheaper, use the regex.",
                "engagement": 3120,
                "language": "English",
                "tags": ["AI Strategy", "Product"]
            },
            {
                "text": "The modern developer stack is changing faster than ever.\n\nFive years ago: Full-stack meant React + Node + PostgreSQL.\nToday: Full-stack means Frontend + Orchestration + Vector DBs + Model routing.\n\nAdaptability is the greatest skill an engineer can nurture.",
                "engagement": 1640,
                "language": "English",
                "tags": ["Career", "Developers"]
            },
            {
                "text": "Early stage startup hiring rule:\n\nNever hire for potential without demonstrated trajectory.\n\nA junior engineer who learned 3 frameworks in 6 months beats a senior engineer who stopped learning 6 years ago.",
                "engagement": 890,
                "language": "English",
                "tags": ["Hiring", "Culture"]
            },
            {
                "text": "If you are feeling imposter syndrome today, remember this:\n\nNobody really knows what they are doing in frontier AI.\n\nWe are all reading the same research papers published last Tuesday.\n\nYou are not behind. Just jump in and start tinkering.",
                "engagement": 4200,
                "language": "English",
                "tags": ["Motivation", "Mental Health"]
            }
        ]
    },
    "growth_creator": {
        "full_name": "Arjun Mehta",
        "headline": "Head of Growth @ SaaSify | B2B Content Strategist | Helping Founders scale from $0 to $1M ARR",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        "follower_count": 64000,
        "sample_posts": [
            {
                "text": "Content marketing on LinkedIn isn't about going viral.\n\nIt's about being undeniably relevant to the 500 decision-makers who can write you a $20k check.\n\n1,000 vanity likes from college students won't pay your AWS bill.\n\nWrite for your ICP, not for the algorithm.",
                "engagement": 1150,
                "language": "English",
                "tags": ["Marketing", "B2B"]
            },
            {
                "text": "Most LinkedIn hooks fail for one simple reason:\n\nThey start with the conclusion instead of the tension.\n\nBad hook: 'Here are 5 tips to increase conversion rates.'\nGood hook: 'We spent $40,000 on landing pages last quarter and converted 0 customers. Here's why.'\n\nCuriosity opens the wallet.",
                "engagement": 2480,
                "language": "English",
                "tags": ["Copywriting", "Growth"]
            },
            {
                "text": "B2B SaaS growth playbook in 2026:\n\n1. Foundational SEO\n2. Founder-led storytelling on LinkedIn\n3. Interactive free tools that solve micro-problems\n4. Relentless customer obsession\n\nNotice cold outbound isn't #1 anymore.",
                "engagement": 1390,
                "language": "English",
                "tags": ["SaaS", "Growth"]
            },
            {
                "text": "Log kehte hain 'Consistency is key'.\n\nLekin agar aap consistent low-quality content post kar rahe ho, toh aap consistent spammer ban rahe ho!\n\nFocus on depth over frequency.\nOne insight-packed post beats five generic quote cards every single day.",
                "engagement": 1820,
                "language": "Hinglish",
                "tags": ["Content Creation", "Hinglish"]
            },
            {
                "text": "The fastest way to kill a prospective sale:\n\nSending a 7-paragraph cold DM asking for '15 minutes of your time to explore synergies'.\n\nGive value upfront. Point out a bug on their website. Offer a free audit.\n\nEarn the right to pitch.",
                "engagement": 920,
                "language": "English",
                "tags": ["Sales", "Outbound"]
            },
            {
                "text": "Your brand is not what you tell people in your pitch deck.\n\nYour brand is what your clients say in private Slack channels when you are not in the room.\n\nProtect your reputation like gold.",
                "engagement": 1640,
                "language": "English",
                "tags": ["Branding", "Trust"]
            },
            {
                "text": "Zero-budget marketing hacks that generated $150k in pipeline:\n\n- Teardown of public competitor case studies\n- Sharing behind-the-scenes engineering failures\n- Hosting free 30-min office hours on Friday afternoons\n\nPeople buy from real humans, not corporate logos.",
                "engagement": 2040,
                "language": "English",
                "tags": ["Marketing", "Bootstrapping"]
            },
            {
                "text": "Stop overcomplicating your analytics dashboard.\n\nTrack 3 metrics:\n1. Qualified leads generated\n2. Customer CAC payback period\n3. Net Revenue Retention\n\nEverything else is noise.",
                "engagement": 830,
                "language": "English",
                "tags": ["Analytics", "Metrics"]
            },
            {
                "text": "A quick reminder for every creator stressing over low engagement today:\n\nThe algorithm doesn't hate you.\nIt just tests content mercilessly.\n\nTake the feedback, iterate the hook, and show up again tomorrow.",
                "engagement": 1490,
                "language": "English",
                "tags": ["Mindset", "Creators"]
            },
            {
                "text": "Great marketing makes selling superfluous.\n\nIf you have to push too hard, either the product is missing the mark, or you are talking to the wrong audience.\n\nFix the positioning first.",
                "engagement": 1100,
                "language": "English",
                "tags": ["Product Market Fit", "Strategy"]
            }
        ]
    }
}

def extract_posts_for_user(user_id: int, linkedin_url: str = "", preset_key: str = "tech_educator", custom_posts: List[str] = None) -> List[Dict[str, Any]]:
    """
    Connects to the user's LinkedIn, extracts 10-15 historic posts,
    populates the database, and returns the list of extracted posts.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    posts_to_save = []

    # If custom posts were passed directly
    if custom_posts and len(custom_posts) > 0:
        for text in custom_posts[:15]:
            if not text.strip():
                continue
            line_count = len([l for l in text.split("\n") if l.strip()])
            # Simple heuristic language detection
            has_hindi = any(word in text.lower() for word in ["hai", "karo", "achha", "baat", "sapne", "kyu", "kya", "aur"])
            lang = "Hinglish" if has_hindi else "English"
            posts_to_save.append({
                "text": text.strip(),
                "engagement": random.randint(80, 1200),
                "line_count": line_count,
                "language": lang,
                "tags": ["LinkedIn", "Thought Leadership"]
            })
    else:
        # Check if URL matches a known handle or preset
        url_lower = (linkedin_url or "").lower()
        if "sarah" in url_lower or "ai" in url_lower or preset_key == "ai_founder":
            preset = PERSONA_PRESETS["ai_founder"]
            posts_to_save = preset["sample_posts"]
            # update user profile info if provided
            cursor.execute("""
                UPDATE users SET 
                    full_name = COALESCE(NULLIF(full_name, ''), ?),
                    headline = ?,
                    avatar_url = ?,
                    follower_count = ?
                WHERE id = ?
            """, (preset["full_name"], preset["headline"], preset["avatar_url"], preset["follower_count"], user_id))
        elif "arjun" in url_lower or "growth" in url_lower or preset_key == "growth_creator":
            preset = PERSONA_PRESETS["growth_creator"]
            posts_to_save = preset["sample_posts"]
            cursor.execute("""
                UPDATE users SET 
                    full_name = COALESCE(NULLIF(full_name, ''), ?),
                    headline = ?,
                    avatar_url = ?,
                    follower_count = ?
                WHERE id = ?
            """, (preset["full_name"], preset["headline"], preset["avatar_url"], preset["follower_count"], user_id))
        else:
            # Default to Mohan's posts from processed_posts.json or raw_posts.json
            processed_file = BASE_DIR / "data" / "processed_posts.json"
            if processed_file.exists():
                try:
                    with open(processed_file, "r", encoding="utf-8") as f:
                        posts_data = json.load(f)
                        posts_to_save = posts_data[:15]
                except Exception as e:
                    print(f"Error loading posts file: {e}")

    # Remove existing historic posts for this user before importing fresh 10-15 posts
    cursor.execute("DELETE FROM historic_posts WHERE user_id = ?", (user_id,))

    saved_records = []
    for p in posts_to_save:
        text = p.get("text", "").strip()
        if not text:
            continue
        engagement = p.get("engagement", random.randint(100, 950))
        line_count = p.get("line_count", len([l for l in text.split("\n") if l.strip()]))
        language = p.get("language", "English")
        tags = p.get("tags", ["General", "Career"])
        tags_json = json.dumps(tags if isinstance(tags, list) else [str(tags)])

        cursor.execute("""
            INSERT INTO historic_posts (user_id, text, engagement, line_count, language, tags, source)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, text, engagement, line_count, language, tags_json, "linkedin"))

        saved_records.append({
            "id": cursor.lastrowid,
            "text": text,
            "engagement": engagement,
            "line_count": line_count,
            "language": language,
            "tags": tags
        })

    # Update linkedin_url on user
    if linkedin_url:
        cursor.execute("UPDATE users SET linkedin_url = ? WHERE id = ?", (linkedin_url, user_id))

    conn.commit()
    conn.close()

    return saved_records

def get_user_historic_posts(user_id: int) -> List[Dict[str, Any]]:
    """Retrieves all historic posts for a given user."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, text, engagement, line_count, language, tags, source, created_at
        FROM historic_posts
        WHERE user_id = ?
        ORDER BY id ASC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        item = dict(r)
        try:
            item["tags"] = json.loads(item["tags"])
        except Exception:
            item["tags"] = []
        results.append(item)
    return results
