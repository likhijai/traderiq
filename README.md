# TraderIQ

## Backend service

The `backend/` directory contains a FastAPI application that exposes
market analytics endpoints backed by SQLModel models and Redis caching.

### Running locally

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Tests

Install the development dependencies from `backend/requirements.txt` and run:

```bash
pytest
```
