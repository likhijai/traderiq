"""FastAPI entrypoint for the TraderIQ backend service."""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta
from typing import List

from fastapi import Depends, FastAPI, Path
from sqlmodel import Session, select

from . import crud
from .dependencies import cached_json, close_redis, get_session, init_db
from .models import (
    FiiDiiFlow,
    InefficiencyMetric,
    MacroIndicator,
    MarketSnapshot,
    OptionChain,
    StrategyRecommendation,
)

app = FastAPI(title="TraderIQ Analytics API", version="0.1.0")


@app.on_event("startup")
async def on_startup() -> None:
    init_db()
    await asyncio.to_thread(seed_data)


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await close_redis()


@app.get("/market/snapshots", response_model=List[MarketSnapshot])
async def get_market_snapshots(session: Session = Depends(get_session)) -> List[MarketSnapshot]:
    async def fetch() -> List[dict]:
        return [snapshot.model_dump(mode="json") for snapshot in crud.list_market_snapshots(session)]

    data = await cached_json("market_snapshots", fetch, ttl=120)
    return [MarketSnapshot.model_validate(item) for item in data]


@app.get("/macro/indicators", response_model=List[MacroIndicator])
async def get_macro_indicators(session: Session = Depends(get_session)) -> List[MacroIndicator]:
    async def fetch() -> List[dict]:
        return [indicator.model_dump(mode="json") for indicator in crud.list_macro_indicators(session)]

    data = await cached_json("macro_indicators", fetch, ttl=300)
    return [MacroIndicator.model_validate(item) for item in data]


@app.get("/options/chain/{symbol}", response_model=List[OptionChain])
async def get_option_chain(
    symbol: str = Path(..., description="Underlying ticker symbol", min_length=1),
    session: Session = Depends(get_session),
) -> List[OptionChain]:
    cache_key = f"option_chain:{symbol.upper()}"

    async def fetch() -> List[dict]:
        return [chain.model_dump(mode="json") for chain in crud.list_option_chain(session, symbol.upper())]

    data = await cached_json(cache_key, fetch, ttl=60)
    return [OptionChain.model_validate(item) for item in data]


@app.get("/analytics/inefficiencies", response_model=List[InefficiencyMetric])
async def get_inefficiencies(session: Session = Depends(get_session)) -> List[InefficiencyMetric]:
    metrics = crud.list_inefficiency_metrics(session)
    return metrics


@app.get("/strategies/recommendations", response_model=List[StrategyRecommendation])
async def get_strategy_recommendations(session: Session = Depends(get_session)) -> List[StrategyRecommendation]:
    recommendations = crud.list_strategy_recommendations(session)
    return recommendations


@app.get("/flows/fii-dii", response_model=List[FiiDiiFlow])
async def get_fii_dii_flows(session: Session = Depends(get_session)) -> List[FiiDiiFlow]:
    flows = crud.list_fii_dii_flows(session)
    return flows


def seed_data() -> None:
    """Populate the SQLite database with realistic mock data."""

    from sqlmodel import Session

    from .dependencies import engine

    with Session(engine) as session:
        if session.exec(select(MarketSnapshot)).first():
            return

        now = datetime.utcnow()
        session.add_all(
            [
                MarketSnapshot(
                    index_name="NIFTY 50",
                    level=19654.3 + i * 12,
                    change_percent=0.45 - i * 0.05,
                    timestamp=now - timedelta(minutes=i * 15),
                )
                for i in range(4)
            ]
        )

        today = date.today()
        session.add_all(
            [
                MacroIndicator(
                    name="CPI Inflation",
                    current_value=5.4,
                    previous_value=5.2,
                    unit="%",
                    release_date=today - timedelta(days=7),
                ),
                MacroIndicator(
                    name="GDP Growth YoY",
                    current_value=6.8,
                    previous_value=6.2,
                    unit="%",
                    release_date=today - timedelta(days=30),
                ),
            ]
        )

        session.add_all(
            [
                OptionChain(
                    symbol="NIFTY",
                    expiry=today + timedelta(days=14),
                    strike=19500 + step * 100,
                    call_oi=120000 - step * 3500,
                    put_oi=95000 + step * 4200,
                    iv=14.5 + step * 0.2,
                    ltp=165.5 + step * 5,
                )
                for step in range(5)
            ]
        )

        session.add_all(
            [
                InefficiencyMetric(
                    instrument="BANKNIFTY",
                    metric_name="VWAP Divergence",
                    score=78.2,
                    description="Price trading 1.5% above VWAP with falling volume.",
                    detected_at=now - timedelta(minutes=45),
                ),
                InefficiencyMetric(
                    instrument="NIFTY",
                    metric_name="Options Skew",
                    score=65.4,
                    description="Put IV skew building up indicating downside hedging.",
                    detected_at=now - timedelta(minutes=20),
                ),
            ]
        )

        session.add_all(
            [
                StrategyRecommendation(
                    name="Bull Call Spread",
                    underlying="NIFTY",
                    rationale="IV contraction expected post-event; limited risk setup.",
                    expected_return=12.5,
                    confidence=0.72,
                ),
                StrategyRecommendation(
                    name="Bear Put Spread",
                    underlying="BANKNIFTY",
                    rationale="Negative breadth and rising put IV skew support downside move.",
                    expected_return=15.8,
                    confidence=0.68,
                ),
            ]
        )

        session.add_all(
            [
                FiiDiiFlow(
                    trade_date=today - timedelta(days=i),
                    fii_net=1250.0 - i * 150,
                    dii_net=-840.0 + i * 120,
                    comments="Rolling net positions across derivatives and cash segments.",
                )
                for i in range(5)
            ]
        )

        session.commit()
