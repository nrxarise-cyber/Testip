"""
AEROX FastAPI application entry point.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import init_db
from app.utils.providers import close_http_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: initialize DB on startup, clean up on shutdown."""
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    await init_db()
    logger.info("Database initialized")
    yield
    await close_http_client()
    logger.info("HTTP client closed")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AEROX — IP & Proxy Intelligence API for Telegram Mini App",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(api_router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/api/v1/health", tags=["Health"])
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok", "app": settings.app_name, "version": settings.app_version})
