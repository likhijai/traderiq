"""API layer tests validating HTTP responses and payload structure."""

from __future__ import annotations

from fastapi.testclient import TestClient

from backend.app.models import (
    FiiDiiFlow,
    InefficiencyMetric,
    MacroIndicator,
    MarketSnapshot,
    OptionChain,
    StrategyRecommendation,
)


def test_market_snapshots(client: TestClient) -> None:
    response = client.get("/market/snapshots")
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    assert len(payload) >= 1
    MarketSnapshot.model_validate(payload[0])


def test_macro_indicators(client: TestClient) -> None:
    response = client.get("/macro/indicators")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 1
    MacroIndicator.model_validate(payload[0])


def test_option_chain(client: TestClient) -> None:
    response = client.get("/options/chain/NIFTY")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 5
    OptionChain.model_validate(payload[0])


def test_inefficiencies(client: TestClient) -> None:
    response = client.get("/analytics/inefficiencies")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 1
    InefficiencyMetric.model_validate(payload[0])


def test_strategy_recommendations(client: TestClient) -> None:
    response = client.get("/strategies/recommendations")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 1
    StrategyRecommendation.model_validate(payload[0])


def test_fii_dii_flows(client: TestClient) -> None:
    response = client.get("/flows/fii-dii")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 5
    FiiDiiFlow.model_validate(payload[0])
