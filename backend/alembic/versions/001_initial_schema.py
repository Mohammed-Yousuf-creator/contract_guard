"""initial schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-09-14 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Profiles
    op.create_table(
        'profiles',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('role', sa.String(50), nullable=False, default='AUDITOR'),
        sa.Column('department', sa.String(255), nullable=True),
        sa.Column('hashed_password', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_profiles_email', 'profiles', ['email'])

    # Contracts
    op.create_table(
        'contracts',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_number', sa.String(100), nullable=False, unique=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('department', sa.String(255), nullable=False),
        sa.Column('baseline_value', sa.Numeric(18, 2), nullable=True),
        sa.Column('current_value', sa.Numeric(18, 2), nullable=True),
        sa.Column('baseline_start_date', sa.Date(), nullable=True),
        sa.Column('current_start_date', sa.Date(), nullable=True),
        sa.Column('baseline_completion_date', sa.Date(), nullable=True),
        sa.Column('current_completion_date', sa.Date(), nullable=True),
        sa.Column('contractor', sa.String(255), nullable=True),
        sa.Column('risk_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('risk_level', sa.String(50), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, default='ACTIVE'),
        sa.Column('created_by', sa.String(36), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_contracts_contract_number', 'contracts', ['contract_number'])
    op.create_index('ix_contracts_risk_score', 'contracts', ['risk_score'])
    op.create_index('ix_contracts_risk_level', 'contracts', ['risk_level'])
    op.create_index('ix_contracts_status', 'contracts', ['status'])
    op.create_index('ix_contracts_department', 'contracts', ['department'])

    # Documents
    op.create_table(
        'documents',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_id', sa.String(36), sa.ForeignKey('contracts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_type', sa.String(50), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=True),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('storage_path', sa.String(500), nullable=False),
        sa.Column('mime_type', sa.String(100), nullable=True),
        sa.Column('file_size', sa.BigInteger(), nullable=True),
        sa.Column('processing_status', sa.String(50), nullable=False, default='UPLOADED'),
        sa.Column('uploaded_by', sa.String(36), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_documents_contract_id', 'documents', ['contract_id'])

    # Contract Versions
    op.create_table(
        'contract_versions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_id', sa.String(36), sa.ForeignKey('contracts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_id', sa.String(36), sa.ForeignKey('documents.id', ondelete='SET NULL'), nullable=True),
        sa.Column('version_number', sa.Integer(), nullable=False),
        sa.Column('contract_value', sa.Numeric(18, 2), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('completion_date', sa.Date(), nullable=True),
        sa.Column('contractor', sa.String(255), nullable=True),
        sa.Column('subcontractors', sa.JSON(), nullable=True),
        sa.Column('materials', sa.JSON(), nullable=True),
        sa.Column('scope', sa.Text(), nullable=True),
        sa.Column('milestones', sa.JSON(), nullable=True),
        sa.Column('payment_terms', sa.Text(), nullable=True),
        sa.Column('extracted_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_contract_versions_contract_id', 'contract_versions', ['contract_id'])

    # Changes
    op.create_table(
        'changes',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_id', sa.String(36), sa.ForeignKey('contracts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('from_version', sa.Integer(), nullable=False),
        sa.Column('to_version', sa.Integer(), nullable=False),
        sa.Column('field', sa.String(100), nullable=False),
        sa.Column('old_value', sa.JSON(), nullable=True),
        sa.Column('new_value', sa.JSON(), nullable=True),
        sa.Column('absolute_change', sa.Numeric(18, 2), nullable=True),
        sa.Column('percentage_change', sa.Numeric(8, 2), nullable=True),
        sa.Column('severity', sa.String(50), nullable=False),
        sa.Column('evidence', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_changes_contract_id', 'changes', ['contract_id'])

    # Risk Scores
    op.create_table(
        'risk_scores',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_id', sa.String(36), sa.ForeignKey('contracts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('overall_score', sa.Numeric(5, 2), nullable=False),
        sa.Column('risk_level', sa.String(50), nullable=False),
        sa.Column('factors', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_risk_scores_contract_id', 'risk_scores', ['contract_id'])

    # Review Decisions
    op.create_table(
        'review_decisions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_id', sa.String(36), sa.ForeignKey('contracts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('reviewer_id', sa.String(36), nullable=True),
        sa.Column('decision', sa.String(50), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_review_decisions_contract_id', 'review_decisions', ['contract_id'])

    # Alerts
    op.create_table(
        'alerts',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('contract_id', sa.String(36), sa.ForeignKey('contracts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('risk_level', sa.String(50), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('read', sa.Boolean(), default=False, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_alerts_contract_id', 'alerts', ['contract_id'])

def downgrade() -> None:
    op.drop_table('alerts')
    op.drop_table('review_decisions')
    op.drop_table('risk_scores')
    op.drop_table('changes')
    op.drop_table('contract_versions')
    op.drop_table('documents')
    op.drop_table('contracts')
    op.drop_table('profiles')
