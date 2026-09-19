import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    print("=" * 60)
    print(">> Starting PostMimic - LinkedIn Style Cloner & Multi-Agent Studio")
    print(f">> Web Server:   http://localhost:{PORT}")
    print(f">> API Docs:     http://localhost:{PORT}/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=False)
