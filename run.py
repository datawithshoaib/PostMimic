import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import os
import socket
import subprocess
import webbrowser
import threading
import time
import uvicorn
from app.config import HOST, PORT as DEFAULT_PORT, DB_PATH
from app.db import init_db

def is_port_in_use(host: str, port: int) -> bool:
    """Checks if a socket can connect to host:port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

def free_port_if_in_use(port: int) -> bool:
    """Attempts to kill stale background processes holding the port on Windows."""
    if not is_port_in_use("127.0.0.1", port):
        return True
    
    print(f">> Notice: Port {port} is occupied by a background process. Clearing...")
    try:
        output = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
        pids = set()
        for line in output.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and "LISTENING" in line.upper():
                pid = parts[-1]
                if pid.isdigit() and int(pid) != os.getpid():
                    pids.add(int(pid))
        
        for pid in pids:
            print(f">> Terminating stale process (PID {pid})...")
            subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        time.sleep(1)
        return not is_port_in_use("127.0.0.1", port)
    except Exception as e:
        print(f">> Could not automatically free port {port}: {e}")
        return False

def get_available_port(host: str, start_port: int) -> int:
    """Finds the next free port if the default port cannot be freed."""
    port = start_port
    while is_port_in_use(host, port):
        port += 1
    return port

def open_browser(port: int):
    time.sleep(1.5)
    url = f"http://localhost:{port}"
    print(f">> Opening PostMimic in browser: {url}")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Notice: Could not automatically open browser: {e}")

def main():
    # Ensure port is available or find fallback
    port = DEFAULT_PORT
    if is_port_in_use(HOST, port):
        freed = free_port_if_in_use(port)
        if not freed:
            port = get_available_port(HOST, port + 1)
            print(f">> Port {DEFAULT_PORT} is busy, dynamically switching to: {port}")

    print("=" * 65)
    print("  POSTMIMIC - LINKEDIN STYLE CLONER & MULTI-AGENT STUDIO")
    print("=" * 65)
    print(f"Directory:   {os.path.abspath(os.path.dirname(__file__))}")
    print(f"Database:    {DB_PATH}")
    print(f"Web Server:  http://localhost:{port}")
    print(f"API Docs:    http://localhost:{port}/docs")
    print("=" * 65)

    print(">> Initializing database & seeding historic posts...")
    init_db()
    print(">> Database ready!")

    threading.Thread(target=open_browser, args=(port,), daemon=True).start()

    uvicorn.run("app.main:app", host=HOST, port=port, reload=False, log_level="info")

if __name__ == "__main__":
    main()
