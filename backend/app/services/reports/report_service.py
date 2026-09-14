import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.database.models import Contract, RiskScore, Change, ReviewDecision, ContractVersion


def generate_contract_pdf_report(
    contract: Contract,
    latest_risk: RiskScore = None,
    changes: list = None,
    versions: list = None,
    latest_review: ReviewDecision = None,
    evidence_list: list = None,
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#102a43"),
        spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#627d98"),
        spaceAfter=12,
    )
    h2_style = ParagraphStyle(
        "SectionHeader",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#243b53"),
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334e68"),
    )
    bold_style = ParagraphStyle(
        "BodyBold",
        parent=body_style,
        fontName="Helvetica-Bold",
    )
    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Italic"],
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#829ab1"),
        spaceAfter=10,
    )

    story = []

    # Header
    story.append(Paragraph("CONTRACT GUARD — AUDIT & COMPLIANCE REPORT", title_style))
    story.append(
        Paragraph(
            f"Official Post-Award Governance Review | Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC",
            subtitle_style,
        )
    )
    story.append(
        Paragraph(
            "NOTICE: Decision-support analysis only. Synthesized from registered tender documents and verified addenda.",
            disclaimer_style,
        )
    )
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#334e68"), spaceAfter=14))

    # 1. Contract Overview
    base_val = f"₹{contract.baseline_value:,.2f}" if contract.baseline_value else "N/A"
    curr_val = f"₹{contract.current_value:,.2f}" if contract.current_value else "N/A"
    cost_drift_pct = (
        round(((float(contract.current_value) - float(contract.baseline_value)) / float(contract.baseline_value)) * 100, 1)
        if contract.baseline_value and contract.current_value
        else 0.0
    )

    overview_data = [
        [
            Paragraph("<b>Contract Number:</b>", body_style),
            Paragraph(contract.contract_number, bold_style),
            Paragraph("<b>Department:</b>", body_style),
            Paragraph(contract.department, body_style),
        ],
        [
            Paragraph("<b>Contract Title:</b>", body_style),
            Paragraph(contract.title, body_style),
            Paragraph("<b>Contractor:</b>", body_style),
            Paragraph(contract.contractor or "Unspecified", body_style),
        ],
        [
            Paragraph("<b>Baseline Value:</b>", body_style),
            Paragraph(base_val, body_style),
            Paragraph("<b>Current Value:</b>", body_style),
            Paragraph(f"{curr_val} (<b>+{cost_drift_pct}%</b>)", bold_style),
        ],
        [
            Paragraph("<b>Baseline Completion:</b>", body_style),
            Paragraph(str(contract.baseline_completion_date or "N/A"), body_style),
            Paragraph("<b>Current Completion:</b>", body_style),
            Paragraph(str(contract.current_completion_date or "N/A"), body_style),
        ],
        [
            Paragraph("<b>Oversight Status:</b>", body_style),
            Paragraph(f"<b>{contract.status}</b>", bold_style),
            Paragraph("<b>Risk Classification:</b>", body_style),
            Paragraph(f"<b>{contract.risk_level or 'UNEVALUATED'} ({contract.risk_score or 0}/100)</b>", bold_style),
        ],
    ]

    t_overview = Table(overview_data, colWidths=[120, 150, 120, 140])
    t_overview.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(t_overview)
    story.append(Spacer(1, 12))

    # 2. Risk Assessment & Signals
    story.append(Paragraph("1. Risk Assessment & Key Signals", h2_style))
    factors = (latest_risk.factors if latest_risk and latest_risk.factors else [])
    
    if factors:
        risk_table_data = [["Factor Name", "Score Contribution", "Weight", "Evidence Summary"]]
        for f in factors:
            risk_table_data.append(
                [
                    Paragraph(f"<b>{f.get('name', '')}</b>", body_style),
                    f"{f.get('score', 0)} pts",
                    f"{int(float(f.get('weight', 0)) * 100)}%",
                    Paragraph(f.get("reason", ""), body_style),
                ]
            )
        t_risk = Table(risk_table_data, colWidths=[140, 100, 60, 230])
        t_risk.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#243b53")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f1f5f9")]),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(t_risk)
    else:
        story.append(Paragraph("No active risk factors recorded.", body_style))
    story.append(Spacer(1, 12))

    # 3. Contract Version Progression Timeline
    story.append(Paragraph("2. Cumulative Version Progression", h2_style))
    if versions:
        timeline_data = [["Ver #", "Date", "Valuation", "Completion Target", "Key Scope / Terms"]]
        for v in versions:
            val_str = f"₹{v.contract_value:,.2f}" if v.contract_value else "—"
            timeline_data.append(
                [
                    f"v{v.version_number}",
                    str(v.start_date or v.created_at.strftime('%Y-%m-%d') if v.created_at else "—"),
                    val_str,
                    str(v.completion_date or "—"),
                    Paragraph(v.scope or v.payment_terms or "Standard specs", body_style),
                ]
            )
        t_time = Table(timeline_data, colWidths=[45, 75, 100, 100, 210])
        t_time.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#334e68")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(t_time)
    story.append(Spacer(1, 12))

    # 4. Material Changes & Evidence
    story.append(Paragraph("3. Material Contract Deviations & Citations", h2_style))
    if changes:
        change_table_data = [["Field", "Baseline / Prior", "Current / New", "Variance", "Severity"]]
        for c in changes:
            old_val_str = f"₹{float(c.old_value):,.2f}" if isinstance(c.old_value, (int, float)) else str(c.old_value or "—")
            new_val_str = f"₹{float(c.new_value):,.2f}" if isinstance(c.new_value, (int, float)) else str(c.new_value or "—")
            pct_str = f"+{c.percentage_change}%" if c.percentage_change else "—"
            change_table_data.append(
                [
                    Paragraph(f"<b>{c.field.replace('_', ' ').title()}</b>", body_style),
                    Paragraph(old_val_str, body_style),
                    Paragraph(new_val_str, body_style),
                    pct_str,
                    Paragraph(f"<b>{c.severity}</b>", body_style),
                ]
            )
        t_changes = Table(change_table_data, colWidths=[120, 120, 120, 80, 90])
        t_changes.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#486581")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(t_changes)
    story.append(Spacer(1, 14))

    # 5. Review Decision & Auditor Determination
    story.append(Paragraph("4. Auditor Review & Determination", h2_style))
    decision_text = latest_review.decision if latest_review else "PENDING_REVIEW"
    notes_text = latest_review.notes if latest_review and latest_review.notes else "No notes submitted."
    timestamp_text = latest_review.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if latest_review else "Awaiting action"

    review_data = [
        [Paragraph("<b>Current Determination:</b>", body_style), Paragraph(f"<b>{decision_text}</b>", bold_style)],
        [Paragraph("<b>Determined On:</b>", body_style), Paragraph(timestamp_text, body_style)],
        [Paragraph("<b>Auditor Findings & Directives:</b>", body_style), Paragraph(notes_text, body_style)],
    ]
    t_review = Table(review_data, colWidths=[160, 370])
    t_review.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(t_review)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
