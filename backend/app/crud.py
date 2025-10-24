"""Data access helpers for the TraderIQ backend."""

from __future__ import annotations

from datetime import datetime
from typing import Iterable, List

from sqlmodel import Session, select

from .models import (
    FiiDiiFlow,
    InefficiencyMetric,
    MacroIndicator,
    MarketSnapshot,
    OptionChain,
    StrategyRecommendation,
)


def list_market_snapshots(session: Session) -> List[MarketSnapshot]:
    return session.exec(select(MarketSnapshot).order_by(MarketSnapshot.timestamp.desc())).all()


def list_macro_indicators(session: Session) -> List[MacroIndicator]:
    return session.exec(select(MacroIndicator).order_by(MacroIndicator.release_date.desc())).all()


def list_option_chain(session: Session, symbol: str) -> List[OptionChain]:
    return session.exec(
        select(OptionChain)
        .where(OptionChain.symbol == symbol)
        .order_by(OptionChain.expiry, OptionChain.strike)
    ).all()


def list_inefficiency_metrics(session: Session) -> List[InefficiencyMetric]:
    return session.exec(select(InefficiencyMetric).order_by(InefficiencyMetric.detected_at.desc())).all()


def list_strategy_recommendations(session: Session) -> List[StrategyRecommendation]:
    return session.exec(select(StrategyRecommendation).order_by(StrategyRecommendation.confidence.desc())).all()


def list_fii_dii_flows(session: Session) -> List[FiiDiiFlow]:
    return session.exec(select(FiiDiiFlow).order_by(FiiDiiFlow.trade_date.desc())).all()
