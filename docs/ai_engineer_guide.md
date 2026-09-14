# Contract Guard — Core AI Engineer Integration Guide & Helpkit

> **Target Audience**: Core AI / ML Engineer  
> **Purpose**: Technical specification, API contract, integration checklist, and critical compliance guardrails for plugging your AI analysis microservice into Contract Guard.

---

## 1. Architectural Role & Boundary

```
┌────────────────────────────────────────────────────────┐
│               Contract Guard (Platform)                │
│  - React UI, Dashboards, Evidence Viewer               │
│  - Document Ingestion & Storage (Supabase)             │
│  - Audit Determinations & PDF Reporting                │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP POST /analyze
                           ▼
┌────────────────────────────────────────────────────────┐
│             Your Service (Core AI Engine)              │
│  - PDF Text Extraction & OCR                           │
│  - Clause Extraction (Tender consideration, dates)     │
│  - sentence-transformers Semantic Scope Similarity     │
│  - Cumulative Drift Calculations                       │
│  - Multi-Factor Risk Score & Weights                   │
│  - Ground-Truth Evidence Citation Generation           │
└────────────────────────────────────────────────────────┘
```

The platform is completely agnostic of your internal model weights, vector databases, or LLM providers (OpenAI, Anthropic, Gemini, local Ollama/HuggingFace). As long as your microservice serves the `/analyze` endpoint with the expected JSON structure, the entire platform UI will render your results seamlessly.

---

## 2. The Endpoint You Must Expose

Your service must expose an HTTP endpoint:
- **Method**: `POST`
- **Path**: `/analyze` (or any custom path configured in `AI_ANALYSIS_SERVICE_URL`)
- **Content-Type**: `application/json`

### A. Request Payload (Sent by Contract Guard to Your Service)
Whenever an auditor uploads a document or triggers a scan, Contract Guard sends:

```json
{
  "contract_id": "PWD-2026-014",
  "documents": [
    {
      "id": "d1000000-0000-0000-0000-000000000001",
      "filename": "contract.pdf",
      "document_type": "BASELINE",
      "version_number": 0,
      "storage_path": "contracts/.../contract.pdf"
    },
    {
      "id": "d1000000-0000-0000-0000-000000000005",
      "filename": "amendment_4.pdf",
      "document_type": "AMENDMENT",
      "version_number": 4,
      "storage_path": "contracts/.../amendment_4.pdf"
    }
  ],
  "metadata": {
    "contract_number": "PWD-2026-014",
    "title": "Eastern Arterial Expressway Flyover & Underpass",
    "department": "Public Works Department",
    "baseline_value": 100000000.0,
    "current_value": 141000000.0,
    "baseline_completion_date": "2026-12-31",
    "current_completion_date": "2027-08-31"
  }
}
```

---

### B. Response Payload (Your Service Returns to Contract Guard)
Your service **must** return status `200 OK` with this exact JSON structure:

```json
{
  "contract_id": "PWD-2026-014",
  "current_version": 4,
  "drift": {
    "cost_percentage": 41.0,
    "schedule_days": 243,
    "scope_similarity": 0.68
  },
  "risk": {
    "score": 87.0,
    "level": "CRITICAL"
  },
  "risk_factors": [
    {
      "name": "Cost deviation",
      "score": 28.0,
      "weight": 0.30,
      "reason": "Current value is 41% above baseline (₹10.0 Cr → ₹14.1 Cr)."
    },
    {
      "name": "Schedule deviation",
      "score": 22.0,
      "weight": 0.25,
      "reason": "Completion extended by ~8 months (243 days: Dec 2026 → Aug 2027)."
    },
    {
      "name": "Subcontractor change",
      "score": 15.0,
      "weight": 0.15,
      "reason": "Primary civil engineering novated from XYZ Engineering to DEF Construction."
    },
    {
      "name": "Scope modification",
      "score": 12.0,
      "weight": 0.15,
      "reason": "Scope semantic similarity dropped to 68% against tender baseline."
    },
    {
      "name": "Repeated amendments",
      "score": 10.0,
      "weight": 0.15,
      "reason": "4 cumulative post-award amendments submitted within 14 months."
    }
  ],
  "changes": [
    {
      "field": "contract_value",
      "old_value": 100000000.0,
      "new_value": 141000000.0,
      "absolute_change": 41000000.0,
      "percentage_change": 41.0,
      "severity": "HIGH",
      "evidence": [
        {
          "document_id": "d1000000-0000-0000-0000-000000000001",
          "filename": "contract.pdf",
          "page": 12,
          "source_text": "Clause 4.1: Total contract price is fixed at INR 10,00,00,000 (Ten Crores only).",
          "original_value": "INR 10,00,00,000",
          "new_value": null,
          "field": "contract_value",
          "change_type": "BASELINE"
        },
        {
          "document_id": "d1000000-0000-0000-0000-000000000005",
          "filename": "amendment_4.pdf",
          "page": 4,
          "source_text": "Addendum B: Revised aggregate contract price approved at INR 14,10,00,000.",
          "original_value": "INR 10,00,00,000",
          "new_value": "INR 14,10,00,000",
          "field": "contract_value",
          "change_type": "CUMULATIVE_INCREASE"
        }
      ]
    },
    {
      "field": "completion_date",
      "old_value": "2026-12-31",
      "new_value": "2027-08-31",
      "absolute_change": 243.0,
      "percentage_change": 66.5,
      "severity": "MEDIUM",
      "evidence": [
        {
          "document_id": "d1000000-0000-0000-0000-000000000003",
          "filename": "amendment_2.pdf",
          "page": 3,
          "source_text": "Section 2: Extended completion milestone to August 31, 2027.",
          "original_value": "2026-12-31",
          "new_value": "2027-08-31",
          "field": "completion_date",
          "change_type": "SCHEDULE_SLIP"
        }
      ]
    },
    {
      "field": "subcontractor",
      "old_value": "XYZ Engineering",
      "new_value": "DEF Construction",
      "absolute_change": null,
      "percentage_change": null,
      "severity": "HIGH",
      "evidence": [
        {
          "document_id": "d1000000-0000-0000-0000-000000000004",
          "filename": "amendment_3.pdf",
          "page": 2,
          "source_text": "Article 7: Novation of tier-1 civil engineering to DEF Construction.",
          "original_value": "XYZ Engineering",
          "new_value": "DEF Construction",
          "field": "subcontractor",
          "change_type": "NOVATION"
        }
      ]
    }
  ],
  "timeline": [
    {
      "version": 0,
      "label": "Baseline",
      "date": "2026-01-01",
      "contract_value": 100000000.0,
      "completion_date": "2026-12-31",
      "major_changes": "Initial award baseline tender"
    },
    {
      "version": 1,
      "label": "Amendment 1",
      "date": "2026-04-15",
      "contract_value": 108000000.0,
      "completion_date": "2026-12-31",
      "major_changes": "+8% steel price escalation"
    },
    {
      "version": 2,
      "label": "Amendment 2",
      "date": "2026-08-10",
      "contract_value": 119000000.0,
      "completion_date": "2027-03-31",
      "major_changes": "Foundation redesign & 3mo extension"
    },
    {
      "version": 3,
      "label": "Amendment 3",
      "date": "2026-11-20",
      "contract_value": 128000000.0,
      "completion_date": "2027-05-31",
      "major_changes": "Novation to DEF Construction"
    },
    {
      "version": 4,
      "label": "Amendment 4",
      "date": "2027-02-14",
      "contract_value": 141000000.0,
      "completion_date": "2027-08-31",
      "major_changes": "Interchange expansion; total value reached ₹14.1 Cr (+41%)"
    }
  ],
  "evidence": []
}
```

---

## 3. What You Must Implement (Core AI Scope)

### 1. Document Extraction
- Extract:
  - Total agreed contract value / consideration
  - Scheduled completion date
  - Contractor / Consortia name
  - Named Subcontractors (Tier-1 execution entities)
  - Scope of work narrative / specification paragraphs

### 2. Sentence-Transformers & Scope Similarity
- Compare the **Baseline tender scope** text against each **Amendment scope** text using sentence embeddings (e.g. `all-MiniLM-L6-v2` or `paraphrase-multilingual-mpnet-base-v2`).
- Compute cosine similarity:
  $$\text{similarity} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$
- Return `scope_similarity` as a float between `0.0` (completely disconnected) and `1.0` (identical).

### 3. Cumulative Drift Metrics
- **Cost Drift**: $\frac{\text{Current Value} - \text{Baseline Value}}{\text{Baseline Value}} \times 100$
- **Schedule Slip**: Difference in calendar days between baseline target completion and latest amendment completion.

### 4. Risk Score Calculation
- **Range**: `0.0` to `100.0`
- **Thresholds**:
  - `0 - 34`: **LOW**
  - `35 - 59`: **MEDIUM**
  - `60 - 79`: **HIGH**
  - `80 - 100`: **CRITICAL**
- Provide a breakdown of individual `risk_factors` (name, score contribution, weight between 0.0–1.0, and human-readable reason).

### 5. Ground-Truth Evidence Citations
- For every material change detected, extract the supporting verbatim clause from the PDF.
- Supply:
  - `filename`: e.g. `contract.pdf` or `amendment_4.pdf`
  - `page`: 1-indexed page number where the clause appears
  - `source_text`: The exact sentence or clause quoting the price, date, or novation

---

## 4. Critical Rules & What to Be Careful Of

### ⚠️ Pitfall 1: Language & Advisory Policy (Non-Negotiable)
- **NEVER** use accusatory or criminal language in your reasons, factors, or summaries:
  - ❌ Do NOT say: *"Fraud detected in contractor billing"*
  - ❌ Do NOT say: *"Corrupt kickback variation"*
  - ❌ Do NOT say: *"Illegal contract amendment"*
- **ALWAYS** use objective regulatory oversight terminology:
  - ✅ *"Cost deviation exceeds 25% threshold"*
  - ✅ *"Material scope modification detected (68% similarity)"*
  - ✅ *"Subcontractor entity novation observed"*
  - ✅ *"Schedule slippage of 243 days recorded"*

### ⚠️ Pitfall 2: Data Formatting & Types
- `cost_percentage`: Float number (e.g., `41.0`). **Do not send strings** like `"+41%"` or `"41.0%"`. The frontend handles currency and percentage symbol formatting.
- `scope_similarity`: Float number between `0.0` and `1.0` (e.g., `0.68`).
- `risk.score`: Numeric float between `0.0` and `100.0` (e.g., `87.0`).
- `risk.level`: Must be one of exact strings: `"LOW"`, `"MEDIUM"`, `"HIGH"`, or `"CRITICAL"`.
- `severity`: In changes, must be one of: `"LOW"`, `"MEDIUM"`, `"HIGH"`, or `"CRITICAL"`.
- `page`: Must be an integer (1-indexed).

### ⚠️ Pitfall 3: Handling Single Baseline Document (Zero Drift State)
- When only the baseline document is registered (Version 0):
  - `current_version`: `0`
  - `cost_percentage`: `0.0`
  - `schedule_days`: `0`
  - `scope_similarity`: `1.0`
  - `risk.score`: `< 20.0` (`LOW`)
  - Ensure your service does not crash when there is only one document in the `documents` list!

### ⚠️ Pitfall 4: Response Latency & Timeouts
- Contract Guard sets an HTTP client timeout of **120 seconds** on the `/analyze` call.
- If your LLM chain or OCR pipeline takes longer than 120 seconds, please implement asynchronous chunking or caching to avoid gateway timeouts.

---

## 5. How to Connect Your Service to Contract Guard

1. Start your AI service on any port (e.g. `http://localhost:8001`).
2. Open `backend/.env` in the Contract Guard folder:
   ```bash
   USE_MOCK_AI=false
   AI_ANALYSIS_SERVICE_URL=http://localhost:8001
   ```
3. Restart the backend:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. Now, whenever an auditor uploads a document or clicks **Run AI Compliance Scan** on the frontend (`http://localhost:5173`), Contract Guard will send the request directly to your service and visualize your live AI results!

---

## 6. Self-Test cURL Command for Your Service

Before connecting to Contract Guard, verify your service by running:

```bash
curl -X POST http://localhost:8001/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "contract_id": "TEST-001",
    "documents": [],
    "metadata": {
      "contract_number": "TEST-001",
      "baseline_value": 100000000,
      "current_value": 141000000
    }
  }'
```

If your service responds with HTTP 200 and matches the JSON schema in Section 2B, Contract Guard will connect seamlessly!
