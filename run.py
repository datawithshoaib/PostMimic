"""
Start PostMimic: FastAPI backend + Next.js frontend from one command.

Usage:
    python run.py
"""

from __future__ import annotations

import atexit
import os
import shutil
import signal
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = REPO_ROOT / "backend"
FRONTEND_DIR = REPO_ROOT / "frontend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import uvicorn
from app.config import DB_PATH, HOST, PORT as DEFAULT_API_PORT
from app.db import init_db

DEFAULT_FRONTEND_PORT = int(os.getenv("FRONTEND_PORT", "2345"))

_frontend_process: subprocess.Popen | None = None


def is_port_in_use(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.5)
        return sock.connect_ex((host, port)) == 0


def free_port_if_in_use(port: int) -> bool:
    if not is_port_in_use("127.0.0.1", port):
        return True

    if sys.platform != "win32":
        return False

    print(f">> Notice: Port {port} is occupied. Attempting to clear (Windows)...")
    try:
        output = subprocess.check_output(
            f"netstat -ano | findstr :{port}",
            shell=True,
        ).decode(errors="replace")
        pids: set[int] = set()
        for line in output.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and "LISTENING" in line.upper():
                pid = parts[-1]
                if pid.isdigit() and int(pid) != os.getpid():
                    pids.add(int(pid))

        for pid in pids:
            print(f">> Terminating stale process (PID {pid})...")
            subprocess.run(
                f"taskkill /F /PID {pid}",
                shell=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )

        time.sleep(1)
        return not is_port_in_use("127.0.0.1", port)
    except Exception as exc:
        print(f">> Could not automatically free port {port}: {exc}")
        return False


def get_available_port(host: str, start_port: int) -> int:
    port = start_port
    while is_port_in_use(host, port):
        port += 1
    return port


def resolve_port(host: str, preferred: int, label: str) -> int:
    port = preferred
    if is_port_in_use(host, port):
        if free_port_if_in_use(port):
            return port
        port = get_available_port(host, port + 1)
        print(f">> {label} port {preferred} busy; using {port} instead.")
    return port


def npm_command() -> list[str]:
    npm = shutil.which("npm")
    if not npm:
        raise RuntimeError("npm is not on PATH. Install Node.js to run the Next.js UI.")
    return [npm]


def ensure_frontend_installed() -> None:
    if (FRONTEND_DIR / "node_modules").is_dir():
        return
    print(">> Installing frontend dependencies (first run)...")
    subprocess.run(
        npm_command() + ["install"],
        cwd=FRONTEND_DIR,
        check=True,
    )


def start_frontend(api_port: int, frontend_port: int) -> subprocess.Popen:
    ensure_frontend_installed()

    env = os.environ.copy()
    env["API_PROXY_TARGET"] = f"http://127.0.0.1:{api_port}"

    cmd = npm_command() + ["run", "dev", "--", "-p", str(frontend_port)]
    print(f">> Starting Next.js on http://localhost:{frontend_port} ...")

    kwargs: dict = {
        "cwd": FRONTEND_DIR,
        "env": env,
    }
    if sys.platform == "win32":
        kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP

    return subprocess.Popen(cmd, **kwargs)


def stop_frontend() -> None:
    global _frontend_process
    proc = _frontend_process
    if proc is None or proc.poll() is not None:
        return

    print("\n>> Shutting down Next.js...")
    try:
        if sys.platform == "win32":
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
        else:
            proc.terminate()
            proc.wait(timeout=8)
    except Exception:
        proc.kill()
    finally:
        _frontend_process = None


def wait_for_frontend(port: int, timeout: float = 90.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        if is_port_in_use("127.0.0.1", port):
            return True
        if _frontend_process and _frontend_process.poll() is not None:
            return False
        time.sleep(0.4)
    return False


def open_browser_when_ready(frontend_port: int, api_port: int) -> None:
    if not wait_for_frontend(frontend_port):
        print(">> Warning: Next.js did not become ready in time; open the UI manually.")
        return
    url = f"http://localhost:{frontend_port}"
    print(f">> Opening {url}")
    print(f">> API docs: http://localhost:{api_port}/docs")
    try:
        webbrowser.open(url)
    except Exception as exc:
        print(f">> Could not open browser: {exc}")


def main() -> None:
    global _frontend_process

    api_port = resolve_port(HOST, DEFAULT_API_PORT, "API")
    frontend_port = resolve_port("127.0.0.1", DEFAULT_FRONTEND_PORT, "Frontend")

    print("=" * 65)
    print("  POSTMIMIC — LinkedIn Style Cloner & Multi-Agent Studio")
    print("=" * 65)
    print(f"Repo root:   {REPO_ROOT}")
    print(f"Database:    {DB_PATH}")
    print(f"API:         http://{HOST}:{api_port}")
    print(f"UI:          http://localhost:{frontend_port}")
    print("=" * 65)

    print(">> Initializing database...")
    init_db()
    print(">> Database ready.")

    atexit.register(stop_frontend)

    def handle_signal(signum, _frame):
        stop_frontend()
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_signal)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, handle_signal)

    try:
        _frontend_process = start_frontend(api_port, frontend_port)
    except RuntimeError as exc:
        print(f">> {exc}")
        print(">> Starting API only. Run `cd frontend && npm run dev` in another terminal.")
        _frontend_process = None
    except subprocess.CalledProcessError:
        print(">> Frontend install failed. Fix npm errors, then re-run run.py.")
        sys.exit(1)

    if _frontend_process is not None:
        threading.Thread(
            target=open_browser_when_ready,
            args=(frontend_port, api_port),
            daemon=True,
        ).start()

    print(">> Starting FastAPI (Ctrl+C stops API and Next.js)...")
    try:
        uvicorn.run(
            "app.main:app",
            host=HOST,
            port=api_port,
            reload=False,
            log_level="info",
        )
    finally:
        stop_frontend()


if __name__ == "__main__":
    main()
