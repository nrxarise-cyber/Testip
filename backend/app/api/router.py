"""
Aggregated API router — mounts all feature routers under /api/v1.
"""

from fastapi import APIRouter

from app.api import ip_checker, proxy_checker, bulk_checker, history

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(ip_checker.router)
api_router.include_router(proxy_checker.router)
api_router.include_router(bulk_checker.router)
api_router.include_router(history.router)
