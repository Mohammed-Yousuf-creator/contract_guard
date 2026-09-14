import pytest
from app.services.analysis.ai_client import MockAIAnalysisClient


@pytest.mark.asyncio
async def test_mock_ai_analysis_client_direct():
    client = MockAIAnalysisClient()
    result = await client.analyze_contract(
        contract_id="PWD-2026-014",
        documents=[],
        contract_metadata={"contract_number": "PWD-2026-014"},
    )

    # Verify shared AI result contract specifications
    assert result.contract_id == "PWD-2026-014"
    assert result.current_version == 4
    assert result.drift.cost_percentage == 41.0
    assert result.drift.schedule_days == 243
    assert result.drift.scope_similarity == 0.68
    assert result.risk.score == 87.0
    assert result.risk.level == "CRITICAL"

    # Verify risk factors
    factor_names = [f.name for f in result.risk_factors]
    assert "Cost deviation" in factor_names
    assert "Schedule deviation" in factor_names
    assert "Subcontractor change" in factor_names

    # Verify changes
    fields = [c.field for c in result.changes]
    assert "contract_value" in fields
    val_change = next(c for c in result.changes if c.field == "contract_value")
    assert val_change.old_value == 100000000.0
    assert val_change.new_value == 141000000.0
    assert val_change.percentage_change == 41.0

    # Verify evidence citations
    assert len(val_change.evidence) >= 1
    doc_filenames = [e.filename for e in val_change.evidence]
    assert "contract.pdf" in doc_filenames or "amendment_4.pdf" in doc_filenames


def test_analyze_endpoint(client):
    res = client.post("/api/v1/contracts/PWD-2026-014/analyze")
    assert res.status_code == 200
    data = res.json()
    assert data["drift"]["cost_percentage"] == 41.0
    assert data["risk"]["score"] == 87.0
    assert data["risk"]["level"] == "CRITICAL"
