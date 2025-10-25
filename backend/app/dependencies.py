"""Application level dependencies such as database and cache clients."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Awaitable, Callable, Iterator, Optional, TypeVar

from redis.asyncio import Redis
from sqlmodel import Session, SQLModel, create_engine

try:  # Prefer fakeredis for local development/testing when available
    from fakeredis.aioredis import FakeRedis
except ImportError:  # pragma: no cover - fallback if fakeredis missing
    FakeRedis = None  # type: ignore


def _default_sqlite_url() -> str:
    """Return a SQLite URL that works regardless of the current directory."""

    module_root = Path(__file__).resolve().parent.parent
    db_path = module_root / "data.db"
    db_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        path_for_url = db_path.relative_to(Path.cwd())
    except ValueError:
        path_for_url = db_path
    return f"sqlite:///{path_for_url.as_posix()}"


_DATABASE_URL = os.getenv("DATABASE_URL", _default_sqlite_url())
_CONNECT_ARGS = {"check_same_thread": False} if _DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(_DATABASE_URL, connect_args=_CONNECT_ARGS, echo=False)

_redis_client: Optional[Redis] = None


def init_db() -> None:
    """Initialise the database schema."""

    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """Provide a SQLModel session."""

    with Session(engine) as session:
        yield session


async def get_redis() -> Redis:
    """Return a Redis client, using fakeredis when a real server is unavailable."""

    global _redis_client
    if _redis_client is None:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        client = Redis.from_url(redis_url, decode_responses=True)
        try:
            await client.ping()
        except Exception:  # pragma: no cover - executed when redis is unavailable
            if FakeRedis is None:
                raise
            client = FakeRedis()
        _redis_client = client
    return _redis_client


async def close_redis() -> None:
    """Close the Redis connection on shutdown."""

    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None


T = TypeVar("T")


async def cached_json(
    key: str,
    fetcher: Callable[[], Awaitable[T]],
    ttl: int = 60,
) -> T:
    """Fetch a value using Redis caching with JSON serialisation."""

    client = await get_redis()
    cached = await client.get(key)
    if cached:
        payload = json.loads(cached)
        return payload  # type: ignore[return-value]

    result = await fetcher()
    await client.set(key, json.dumps(result), ex=ttl)
    return result
