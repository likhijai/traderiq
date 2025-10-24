"""Unit tests for database access helpers."""

from __future__ import annotations

from sqlmodel import Session

from backend.app import crud
from backend.app.models import FiiDiiFlow, MarketSnapshot, OptionChain


def test_list_market_snapshots(session: Session) -> None:
    snapshots = crud.list_market_snapshots(session)
    assert len(snapshots) >= 1
    assert isinstance(snapshots[0], MarketSnapshot)


def test_list_option_chain(session: Session) -> None:
    chains = crud.list_option_chain(session, "NIFTY")
    assert len(chains) == 5
    assert all(isinstance(item, OptionChain) for item in chains)


def test_list_fii_dii_flows(session: Session) -> None:
    flows = crud.list_fii_dii_flows(session)
    assert len(flows) == 5
    assert isinstance(flows[0], FiiDiiFlow)
