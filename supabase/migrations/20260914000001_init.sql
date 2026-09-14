-- Contract Guard Supabase Schema & Row-Level Security

-- 1. Profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'AUDITOR' CHECK (role IN ('ADMIN', 'AUDITOR')),
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(255) NOT NULL,
    baseline_value NUMERIC(18, 2),
    current_value NUMERIC(18, 2),
    baseline_start_date DATE,
    current_start_date DATE,
    baseline_completion_date DATE,
    current_completion_date DATE,
    contractor VARCHAR(255),
    risk_score NUMERIC(5, 2),
    risk_level VARCHAR(50) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNDER_REVIEW', 'CLEARED', 'ESCALATED', 'CLOSED')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('BASELINE', 'AMENDMENT', 'INVOICE', 'PROGRESS_REPORT')),
    version_number INTEGER,
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED' CHECK (processing_status IN ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Contract Versions table (Immutable historical snapshot)
CREATE TABLE IF NOT EXISTS public.contract_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    version_number INTEGER NOT NULL,
    contract_value NUMERIC(18, 2),
    start_date DATE,
    completion_date DATE,
    contractor VARCHAR(255),
    subcontractors JSONB,
    materials JSONB,
    scope TEXT,
    milestones JSONB,
    payment_terms TEXT,
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Changes table
CREATE TABLE IF NOT EXISTS public.changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    from_version INTEGER NOT NULL,
    to_version INTEGER NOT NULL,
    field VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    absolute_change NUMERIC(18, 2),
    percentage_change NUMERIC(8, 2),
    severity VARCHAR(50) NOT NULL,
    evidence JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Risk Scores table
CREATE TABLE IF NOT EXISTS public.risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Review Decisions table
CREATE TABLE IF NOT EXISTS public.review_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('UNDER_REVIEW', 'CLEARED', 'ESCALATED', 'NEEDS_EVIDENCE')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    risk_level VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes as specified in Section 5
CREATE INDEX IF NOT EXISTS idx_contracts_number ON public.contracts (contract_number);
CREATE INDEX IF NOT EXISTS idx_contracts_risk_score ON public.contracts (risk_score);
CREATE INDEX IF NOT EXISTS idx_contracts_risk_level ON public.contracts (risk_level);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts (status);
CREATE INDEX IF NOT EXISTS idx_documents_contract ON public.documents (contract_id);
CREATE INDEX IF NOT EXISTS idx_versions_contract ON public.contract_versions (contract_id);
CREATE INDEX IF NOT EXISTS idx_changes_contract ON public.changes (contract_id);
CREATE INDEX IF NOT EXISTS idx_reviews_contract ON public.review_decisions (contract_id);
CREATE INDEX IF NOT EXISTS idx_alerts_contract ON public.alerts (contract_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Policies for Authenticated Government Auditors
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read contracts" ON public.contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create contracts" ON public.contracts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update contracts" ON public.contracts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read versions" ON public.contract_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read changes" ON public.changes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read risk scores" ON public.risk_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read review decisions" ON public.review_decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can submit review decisions" ON public.review_decisions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);
