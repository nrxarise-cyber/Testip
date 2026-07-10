"""
Application configuration loaded from environment variables.
All settings have sensible defaults so the app runs without a .env file.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ───────────────────────────────────────────────────────────
    app_name: str = "AEROX"
    app_version: str = "1.0.0"
    debug: bool = False
    port: int = 8000

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = "sqlite+aiosqlite:///./aerox.db"

    # ── CORS ──────────────────────────────────────────────────────────────────
    cors_origins: list[str] = ["*"]

    # ── External API keys (all optional – providers skip gracefully) ──────────
    ipinfo_token: str = ""           # https://ipinfo.io/signup  (free 50k/mo)
    proxycheck_api_key: str = ""     # https://proxycheck.io     (free 100/day)
    abuseipdb_api_key: str = ""      # https://www.abuseipdb.com (free 1k/day)

    # ── Proxy check ───────────────────────────────────────────────────────────
    proxy_check_timeout: int = 15    # seconds per proxy attempt
    proxy_check_target: str = "https://httpbin.org/ip"

    # ── Bulk check limits ─────────────────────────────────────────────────────
    bulk_max_proxies: int = 10


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings singleton."""
    return Settings()
