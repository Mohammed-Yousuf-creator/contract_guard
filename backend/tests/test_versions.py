def test_list_versions(client):
    res = client.get("/api/v1/contracts/PWD-2026-014/versions")
    assert res.status_code == 200
    versions = res.json()
    assert len(versions) >= 5
    version_numbers = [v["version_number"] for v in versions]
    assert 0 in version_numbers
    assert 4 in version_numbers

    # Test get specific version
    res_v4 = client.get("/api/v1/contracts/PWD-2026-014/versions/4")
    assert res_v4.status_code == 200
    v4 = res_v4.json()
    assert v4["version_number"] == 4
    assert v4["contract_value"] == 141000000.0
