from app.db import get_db_connection
from app.schemas.profile import ProfileUpdateRequest


def update_user_profile(user_id: int, req: ProfileUpdateRequest) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        UPDATE users
        SET full_name = COALESCE(?, full_name),
            headline = COALESCE(?, headline),
            avatar_url = COALESCE(?, avatar_url),
            linkedin_url = COALESCE(?, linkedin_url)
        WHERE id = ?
        """,
        (req.full_name, req.headline, req.avatar_url, req.linkedin_url, user_id),
    )
    conn.commit()
    conn.close()
