def test_list_contracts(client):
    response = client.get("/api/v1/contracts")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 8
    # Flagship contract should be present
    contract_numbers = [c["contract_number"] for c in data["items"]]
    assert "PWD-2026-014" in contract_numbers


def test_get_flagship_contract(client):
    response = client.get("/api/v1/contracts/PWD-2026-014")
    assert response.status_code == 200
    contract = response.json()
    assert contract["contract_number"] == "PWD-2026-014"
    assert contract["risk_score"] == 87.0
    assert contract["risk_level"] == "CRITICAL"
    assert contract["baseline_value"] == 100000000.0
    assert contract["current_value"] == 141000000.0


def test_create_and_delete_contract(client):
    new_contract = {
        "contract_number": "TEST-2026-999",
        "title": "SYNTHETIC TEST: Bridge Retrofitting",
        "department": "Public Works Department",
        "contractor": "Test Builders Inc",
        "baseline_value": 25000000.0,
        "current_value": 25000000.0,
        "baseline_start_date": "2026-01-01",
        "baseline_completion_date": "2026-12-31",
        "status": "ACTIVE",
    }
    create_res = client.post("/api/v1/contracts", json=new_contract)
    assert create_res.status_code == 201
    created = create_res.json()
    contract_id = created["id"]
    assert created["contract_number"] == "TEST-2026-999"

    # Patch
    patch_res = client.patch(f"/api/v1/contracts/{contract_id}", json={"title": "Updated Title"})
    assert patch_res.status_code == 200
    assert patch_res.json()["title"] == "Updated Title"

    # Delete
    del_res = client.delete(f"/api/v1/contracts/{contract_id}")
    assert del_res.status_code == 200

    # Verify not found
    get_res = client.get(f"/api/v1/contracts/{contract_id}")
    assert get_res.status_code == 404
