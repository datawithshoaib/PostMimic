import json

from app.db import get_db_connection
from app.schemas.posts import AddHistoricPostRequest


def add_historic_post(user_id: int, req: AddHistoricPostRequest) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    line_cnt = len([line for line in req.text.split("\n") if line.strip()])
    tags_json = json.dumps(req.tags if req.tags else ["Custom"])

    cursor.execute(
        """
        INSERT INTO historic_posts (user_id, text, engagement, line_count, language, tags, source)
        VALUES (?, ?, ?, ?, ?, ?, 'manual')
        """,
        (user_id, req.text.strip(), req.engagement, line_cnt, req.language, tags_json),
    )
    post_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return post_id


def delete_historic_post(user_id: int, post_id: int) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM historic_posts WHERE id = ? AND user_id = ?",
        (post_id, user_id),
    )
    conn.commit()
    conn.close()
