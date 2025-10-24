"""Database models for the TraderIQ backend."""

from __future__ import annotations

from datetime import datetime, date
from typing import Optional

from sqlmodel import SQLModel, Field


class MarketSnapshot(SQLModel, table=True):
    """Represents a market index snapshot."""

    id: Optional[int] = Field(default=None, primary_key=True)
    index_name: str
    level: float
    change_percent: float
    timestamp: datetime


class MacroIndicator(SQLModel, table=True):
    """Macro-economic indicator readings."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    current_value: float
    previous_value: float
    unit: str
    release_date: date


class OptionChain(SQLModel, table=True):
    """Option chain snapshot for a given symbol and strike."""

    id: Optional[int] = Field(default=None, primary_key=True)
    symbol: str
    expiry: date
    strike: float
    call_oi: int
    put_oi: int
    iv: float
    ltp: float


class InefficiencyMetric(SQLModel, table=True):
    """Represents market inefficiency metrics from quantitative scans."""

    id: Optional[int] = Field(default=None, primary_key=True)
    instrument: str
    metric_name: str
    score: float
    description: str
    detected_at: datetime


class StrategyRecommendation(SQLModel, table=True):
    """Suggested options strategies derived from analytics."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    underlying: str
    rationale: str
    expected_return: float
    confidence: float


class FiiDiiFlow(SQLModel, table=True):
    """Foreign and domestic institutional investor flows."""

    id: Optional[int] = Field(default=None, primary_key=True)
    trade_date: date
    fii_net: float
    dii_net: float
    comments: str
