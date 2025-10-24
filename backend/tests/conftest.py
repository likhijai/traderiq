"""Pytest configuration and fixtures for backend tests."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

os.environ.setdefault("DATABASE_URL", "sqlite:///./backend/test.db")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

from backend.app.main import app  # noqa: E402  (import after env vars set)
from backend.app.dependencies import engine  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def clean_test_database() -> Iterator[None]:
    """Ensure the test database is removed before and after the test session."""

    db_url = os.environ["DATABASE_URL"]
    if db_url.startswith("sqlite"):
        db_path = Path(db_url.split("sqlite:///")[-1])
        if db_path.exists():
            db_path.unlink()
    yield
    if db_url.startswith("sqlite"):
        db_path = Path(db_url.split("sqlite:///")[-1])
        if db_path.exists():
            db_path.unlink()


@pytest.fixture()
def client() -> Iterator[TestClient]:
    """Provide a FastAPI test client with lifecycle events executed."""

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def session() -> Iterator[Session]:
    """Provide a database session for data-layer tests."""

    with Session(engine) as db_session:
        yield db_session
