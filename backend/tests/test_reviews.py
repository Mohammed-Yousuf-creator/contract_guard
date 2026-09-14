def test_create_and_list_reviews(client):
    # Post review decision ESCALATED
    review_data = {
        "decision": "ESCALATED",
        "notes": "Escalated for immediate audit review due to cumulative 41% drift.",
    }
    res = client.post("/api/v1/contracts/PWD-2026-014/reviews", json=review_data)
    assert res.status_code == 201
    created_review = res.json()
    assert created_review["decision"] == "ESCALATED"
    assert created_review["notes"] == review_data["notes"]

    # Verify contract status updated to ESCALATED
    contract_res = client.get("/api/v1/contracts/PWD-2026-014")
    assert contract_res.json()["status"] == "ESCALATED"

    # List reviews
    list_res = client.get("/api/v1/contracts/PWD-2026-014/reviews")
    assert list_res.status_code == 200
    reviews = list_res.json()
    assert len(reviews) >= 1
    assert reviews[0]["decision"] == "ESCALATED"
