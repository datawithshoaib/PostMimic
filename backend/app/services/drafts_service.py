import json
from typing import Any

from app.db import get_db_connection


def list_user_drafts(user_id: int) -> list[dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, topic, length, language, final_post, is_approved, attempts,
               review_feedback, trace_json, created_at
        FROM generated_posts
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,),
    )
    rows = cursor.fetchall()
    conn.close()

    drafts = []
    for row in rows:
        item = dict(row)
        try:
            item["trace"] = json.loads(item["trace_json"])
        except Exception:
            item["trace"] = []
        del item["trace_json"]
        drafts.append(item)
    return drafts


def delete_user_draft(user_id: int, post_id: int) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM generated_posts WHERE id = ? AND user_id = ?",
        (post_id, user_id),
    )
    conn.commit()
    conn.close()
