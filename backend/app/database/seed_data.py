from datetime import date, datetime, timezone
from sqlalchemy.orm import Session
from app.core.logging import logger
from app.database.models import (
    Contract,
    Document,
    ContractVersion,
    Change,
    RiskScore,
    ReviewDecision,
    Alert,
    Profile,
)
from app.core.security import get_password_hash


def seed_demo_data(db: Session):
    # Check if contracts already exist
    existing_count = db.query(Contract).count()
    if existing_count >= 8:
        return

    logger.info("Seeding synthetic government demo data for Contract Guard...")

    # 1. Profiles
    auditor = db.query(Profile).filter(Profile.email == "auditor@contractguard.gov").first()
    if not auditor:
        auditor = Profile(
            id="00000000-0000-0000-0000-000000000001",
            email="auditor@contractguard.gov",
            full_name="Rohan Vernekar (Lead Auditor)",
            role="AUDITOR",
            department="Public Works Oversight Division",
            hashed_password=get_password_hash("AuditGuard2026!"),
        )
        db.add(auditor)

    admin = db.query(Profile).filter(Profile.email == "admin@contractguard.gov").first()
    if not admin:
        admin = Profile(
            id="00000000-0000-0000-0000-000000000002",
            email="admin@contractguard.gov",
            full_name="Director General of Audit",
            role="ADMIN",
            department="Central Procurement Audit Bureau",
            hashed_password=get_password_hash("AdminGuard2026!"),
        )
        db.add(admin)

    db.commit()

    # 2. Main Contract: PWD-2026-014 (CRITICAL RISK)
    c1 = db.query(Contract).filter(Contract.contract_number == "PWD-2026-014").first()
    if not c1:
        c1 = Contract(
            id="10000000-0000-0000-0000-000000000014",
            contract_number="PWD-2026-014",
            title="SYNTHETIC DEMO DATA: Eastern Arterial Expressway Flyover & Underpass",
            description="SYNTHETIC DEMO DATA — Multi-grade interchange and elevated arterial corridor connecting Sector 4 with National Highway spur.",
            department="Public Works Department",
            contractor="DEF Construction",
            baseline_value=100000000.0,
            current_value=141000000.0,
            baseline_start_date=date(2026, 1, 1),
            current_start_date=date(2026, 1, 1),
            baseline_completion_date=date(2026, 12, 31),
            current_completion_date=date(2027, 8, 31),
            risk_score=87.0,
            risk_level="CRITICAL",
            status="UNDER_REVIEW",
            created_by=auditor.id,
        )
        db.add(c1)
        db.commit()
        db.refresh(c1)

        # Main contract documents
        docs = [
            Document(
                id="d1000000-0000-0000-0000-000000000001",
                contract_id=c1.id,
                document_type="BASELINE",
                version_number=0,
                filename="contract.pdf",
                storage_path=f"contracts/{c1.id}/d1/contract.pdf",
                mime_type="application/pdf",
                file_size=4250100,
                processing_status="COMPLETED",
                uploaded_by=auditor.id,
            ),
            Document(
                id="d1000000-0000-0000-0000-000000000002",
                contract_id=c1.id,
                document_type="AMENDMENT",
                version_number=1,
                filename="amendment_1.pdf",
                storage_path=f"contracts/{c1.id}/d2/amendment_1.pdf",
                mime_type="application/pdf",
                file_size=1840200,
                processing_status="COMPLETED",
                uploaded_by=auditor.id,
            ),
            Document(
                id="d1000000-0000-0000-0000-000000000003",
                contract_id=c1.id,
                document_type="AMENDMENT",
                version_number=2,
                filename="amendment_2.pdf",
                storage_path=f"contracts/{c1.id}/d3/amendment_2.pdf",
                mime_type="application/pdf",
                file_size=2190400,
                processing_status="COMPLETED",
                uploaded_by=auditor.id,
            ),
            Document(
                id="d1000000-0000-0000-0000-000000000004",
                contract_id=c1.id,
                document_type="AMENDMENT",
                version_number=3,
                filename="amendment_3.pdf",
                storage_path=f"contracts/{c1.id}/d4/amendment_3.pdf",
                mime_type="application/pdf",
                file_size=1950000,
                processing_status="COMPLETED",
                uploaded_by=auditor.id,
            ),
            Document(
                id="d1000000-0000-0000-0000-000000000005",
                contract_id=c1.id,
                document_type="AMENDMENT",
                version_number=4,
                filename="amendment_4.pdf",
                storage_path=f"contracts/{c1.id}/d5/amendment_4.pdf",
                mime_type="application/pdf",
                file_size=3120800,
                processing_status="COMPLETED",
                uploaded_by=auditor.id,
            ),
        ]
        db.add_all(docs)
        db.commit()

        # Contract Versions
        versions = [
            ContractVersion(
                contract_id=c1.id,
                document_id=docs[0].id,
                version_number=0,
                contract_value=100000000.0,
                start_date=date(2026, 1, 1),
                completion_date=date(2026, 12, 31),
                contractor="Apex Infrastructure Ltd",
                subcontractors=["XYZ Engineering"],
                scope="Grade-separated arterial corridor (Phase 1 tender specs)",
                payment_terms="Milestone based: 20% mobilization, 40% substructure, 40% completion",
            ),
            ContractVersion(
                contract_id=c1.id,
                document_id=docs[1].id,
                version_number=1,
                contract_value=108000000.0,
                start_date=date(2026, 1, 1),
                completion_date=date(2026, 12, 31),
                contractor="Apex Infrastructure Ltd",
                subcontractors=["XYZ Engineering"],
                scope="Steel price indexing escalation clause revision",
            ),
            ContractVersion(
                contract_id=c1.id,
                document_id=docs[2].id,
                version_number=2,
                contract_value=119000000.0,
                start_date=date(2026, 1, 1),
                completion_date=date(2027, 3, 31),
                contractor="Apex Infrastructure Ltd",
                subcontractors=["XYZ Engineering"],
                scope="Geotechnical foundation redesign and utility diversion",
            ),
            ContractVersion(
                contract_id=c1.id,
                document_id=docs[3].id,
                version_number=3,
                contract_value=128000000.0,
                start_date=date(2026, 1, 1),
                completion_date=date(2027, 5, 31),
                contractor="Apex Infrastructure Ltd",
                subcontractors=["DEF Construction"],
                scope="Novation of structural fabrication to DEF Construction",
            ),
            ContractVersion(
                contract_id=c1.id,
                document_id=docs[4].id,
                version_number=4,
                contract_value=141000000.0,
                start_date=date(2026, 1, 1),
                completion_date=date(2027, 8, 31),
                contractor="Apex Infrastructure Ltd",
                subcontractors=["DEF Construction"],
                scope="Extended cloverleaf ramp and 3 auxiliary surface lanes (+41% cost drift)",
            ),
        ]
        db.add_all(versions)

        # Changes
        changes = [
            Change(
                contract_id=c1.id,
                from_version=0,
                to_version=4,
                field="contract_value",
                old_value=100000000.0,
                new_value=141000000.0,
                absolute_change=41000000.0,
                percentage_change=41.0,
                severity="HIGH",
                evidence=[
                    {
                        "document_id": docs[0].id,
                        "filename": "contract.pdf",
                        "page": 12,
                        "source_text": "Clause 4.1: Total contract price is fixed at INR 10,00,00,000 (Ten Crores only).",
                        "original_value": "INR 10,00,00,000",
                        "new_value": None,
                        "field": "contract_value",
                    },
                    {
                        "document_id": docs[4].id,
                        "filename": "amendment_4.pdf",
                        "page": 4,
                        "source_text": "Addendum B: Revised aggregate contract price approved at INR 14,10,00,000.",
                        "original_value": "INR 10,00,00,000",
                        "new_value": "INR 14,10,00,000",
                        "field": "contract_value",
                    },
                ],
            ),
            Change(
                contract_id=c1.id,
                from_version=0,
                to_version=4,
                field="completion_date",
                old_value="2026-12-31",
                new_value="2027-08-31",
                absolute_change=243.0,
                percentage_change=66.5,
                severity="MEDIUM",
                evidence=[
                    {
                        "document_id": docs[2].id,
                        "filename": "amendment_2.pdf",
                        "page": 3,
                        "source_text": "Section 2: Extended completion milestone to August 31, 2027 due to environmental clearance backlog.",
                        "original_value": "2026-12-31",
                        "new_value": "2027-08-31",
                        "field": "completion_date",
                    }
                ],
            ),
            Change(
                contract_id=c1.id,
                from_version=0,
                to_version=4,
                field="subcontractor",
                old_value="XYZ Engineering",
                new_value="DEF Construction",
                severity="HIGH",
                evidence=[
                    {
                        "document_id": docs[3].id,
                        "filename": "amendment_3.pdf",
                        "page": 2,
                        "source_text": "Article 7: Novation of tier-1 civil engineering execution to DEF Construction Pvt Ltd.",
                        "original_value": "XYZ Engineering",
                        "new_value": "DEF Construction",
                        "field": "subcontractor",
                    }
                ],
            ),
        ]
        db.add_all(changes)

        # Risk Score
        risk = RiskScore(
            contract_id=c1.id,
            overall_score=87.0,
            risk_level="CRITICAL",
            factors=[
                {
                    "name": "Cost deviation",
                    "score": 28.0,
                    "weight": 0.30,
                    "reason": "Current value is 41% above baseline.",
                },
                {
                    "name": "Schedule deviation",
                    "score": 22.0,
                    "weight": 0.25,
                    "reason": "Completion extended by ~8 months (Dec 2026 → Aug 2027).",
                },
                {
                    "name": "Subcontractor change",
                    "score": 15.0,
                    "weight": 0.15,
                    "reason": "Novated from XYZ Engineering to DEF Construction.",
                },
                {
                    "name": "Scope modification",
                    "score": 12.0,
                    "weight": 0.15,
                    "reason": "Scope semantic similarity dropped to 68%.",
                },
                {
                    "name": "Repeated amendments",
                    "score": 10.0,
                    "weight": 0.15,
                    "reason": "4 amendments submitted in 14 months.",
                },
            ],
        )
        db.add(risk)

        # Initial review
        rev = ReviewDecision(
            contract_id=c1.id,
            reviewer_id=auditor.id,
            decision="UNDER_REVIEW",
            notes="Flagged for comprehensive audit review due to cumulative +41% cost drift and subcontractor novation.",
        )
        db.add(rev)

        # Critical alert
        alt = Alert(
            contract_id=c1.id,
            risk_level="CRITICAL",
            message="Cumulative cost drift reached +41%. Risk evaluation: CRITICAL (87/100).",
            read=False,
        )
        db.add(alt)

    # 3. Additional synthetic contracts across departments & risk tiers
    other_contracts = [
        {
            "num": "MOH-2026-003",
            "title": "SYNTHETIC DEMO DATA: District Hospital Intensive Care Upgrades",
            "department": "Ministry of Health",
            "contractor": "MedTech Infra Solutions",
            "base_val": 45000000.0,
            "curr_val": 58500000.0,
            "risk_score": 76.0,
            "risk_level": "HIGH",
            "status": "UNDER_REVIEW",
            "factors": [
                {"name": "Cost deviation", "score": 24.0, "weight": 0.4, "reason": "30% cost increase in specialized HVAC equipment"},
                {"name": "Schedule deviation", "score": 18.0, "weight": 0.3, "reason": "4 months delivery delay"},
            ],
        },
        {
            "num": "DOT-2025-108",
            "title": "SYNTHETIC DEMO DATA: Metro Rail Phase II Signalling Installation",
            "department": "Department of Transportation",
            "contractor": "TransitTech Consortium",
            "base_val": 220000000.0,
            "curr_val": 264000000.0,
            "risk_score": 68.0,
            "risk_level": "HIGH",
            "status": "UNDER_REVIEW",
            "factors": [
                {"name": "Cost deviation", "score": 20.0, "weight": 0.4, "reason": "20% cost revision for CBTC software licenses"},
            ],
        },
        {
            "num": "UDD-2026-042",
            "title": "SYNTHETIC DEMO DATA: Stormwater Drainage Channel Revamping",
            "department": "Urban Development Directorate",
            "contractor": "Harbor & City Civil Works",
            "base_val": 35000000.0,
            "curr_val": 39200000.0,
            "risk_score": 48.0,
            "risk_level": "MEDIUM",
            "status": "ACTIVE",
            "factors": [
                {"name": "Cost deviation", "score": 14.0, "weight": 0.5, "reason": "12% cost escalation due to rock excavation"},
            ],
        },
        {
            "num": "WRE-2025-077",
            "title": "SYNTHETIC DEMO DATA: Irrigation Canal Lining & Canal Headworks",
            "department": "Water Resources Enterprise",
            "contractor": "AgriWater Engineering",
            "base_val": 60000000.0,
            "curr_val": 66000000.0,
            "risk_score": 42.0,
            "risk_level": "MEDIUM",
            "status": "ACTIVE",
            "factors": [
                {"name": "Schedule slip", "score": 12.0, "weight": 0.4, "reason": "Monsoon extension granted for 2 months"},
            ],
        },
        {
            "num": "DOE-2026-019",
            "title": "SYNTHETIC DEMO DATA: Solar Rooftop Grid Installation for 40 Schools",
            "department": "Department of Education",
            "contractor": "CleanGrid Technologies",
            "base_val": 18000000.0,
            "curr_val": 18000000.0,
            "risk_score": 18.0,
            "risk_level": "LOW",
            "status": "CLEARED",
            "factors": [
                {"name": "Milestone adherence", "score": 5.0, "weight": 0.2, "reason": "All milestones within ±2% tolerance"},
            ],
        },
        {
            "num": "ITD-2026-005",
            "title": "SYNTHETIC DEMO DATA: State Data Center Hardware Refresh",
            "department": "Information Technology Department",
            "contractor": "Silicon Systems Corp",
            "base_val": 75000000.0,
            "curr_val": 75000000.0,
            "risk_score": 12.0,
            "risk_level": "LOW",
            "status": "CLEARED",
            "factors": [
                {"name": "Procurement compliance", "score": 4.0, "weight": 0.2, "reason": "Fully compliant with SLA metrics"},
            ],
        },
        {
            "num": "POL-2025-088",
            "title": "SYNTHETIC DEMO DATA: Smart City CCTV & Command Center Expansion",
            "department": "Police Department & Home Affairs",
            "contractor": "Surveillance Systems International",
            "base_val": 92000000.0,
            "curr_val": 99500000.0,
            "risk_score": 38.0,
            "risk_level": "MEDIUM",
            "status": "ACTIVE",
            "factors": [
                {"name": "Cost drift", "score": 10.0, "weight": 0.3, "reason": "8% scope expansion for 15 additional junction poles"},
            ],
        },
    ]

    for item in other_contracts:
        if not db.query(Contract).filter(Contract.contract_number == item["num"]).first():
            c = Contract(
                contract_number=item["num"],
                title=item["title"],
                description="SYNTHETIC DEMO DATA generated for procurement auditing and risk oversight simulation.",
                department=item["department"],
                contractor=item["contractor"],
                baseline_value=item["base_val"],
                current_value=item["curr_val"],
                baseline_start_date=date(2026, 1, 1),
                current_start_date=date(2026, 1, 1),
                baseline_completion_date=date(2026, 12, 31),
                current_completion_date=date(2027, 2, 28),
                risk_score=item["risk_score"],
                risk_level=item["risk_level"],
                status=item["status"],
                created_by=auditor.id,
            )
            db.add(c)
            db.commit()
            db.refresh(c)

            # Add baseline document
            doc = Document(
                contract_id=c.id,
                document_type="BASELINE",
                version_number=0,
                filename="original_contract.pdf",
                storage_path=f"contracts/{c.id}/d0/original_contract.pdf",
                mime_type="application/pdf",
                file_size=2048500,
                processing_status="COMPLETED",
                uploaded_by=auditor.id,
            )
            db.add(doc)

            # Add version
            v0 = ContractVersion(
                contract_id=c.id,
                version_number=0,
                contract_value=item["base_val"],
                scope="Baseline awarded scope specifications",
            )
            db.add(v0)

            # Add risk score
            rs = RiskScore(
                contract_id=c.id,
                overall_score=item["risk_score"],
                risk_level=item["risk_level"],
                factors=item["factors"],
            )
            db.add(rs)

            # Add alert if HIGH
            if item["risk_level"] in ["HIGH", "CRITICAL"]:
                alt = Alert(
                    contract_id=c.id,
                    risk_level=item["risk_level"],
                    message=f"Risk signal: {item['num']} evaluated as {item['risk_level']} ({item['risk_score']}/100).",
                    read=False,
                )
                db.add(alt)

    db.commit()
    logger.info("Successfully seeded 8 synthetic contracts with comprehensive metrics and evidence.")
