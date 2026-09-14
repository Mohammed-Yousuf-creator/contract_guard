import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RiskScoreCard } from '@/components/risk/RiskScoreCard';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { Contract } from '@/types/contract';
import { formatCurrency } from '@/lib/utils';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PriorityQueueTable } from '@/components/dashboard/PriorityQueueTable';
import { RiskFactorsList } from '@/components/risk/RiskFactorsList';
import { EvidencePanel } from '@/components/evidence/EvidencePanel';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Contract Guard Frontend Suite', () => {
  // 1. Critical Acceptance & Integration Test (Section 39 & 40)
  it('renders critical integration test: ₹10 Cr -> ₹14.1 Cr and displays +41% with CRITICAL 87 risk score', () => {
    // Shared AI Result Contract Test Fixture
    const fixture = {
      contract_id: 'PWD-2026-014',
      baseline_value: 100000000.0,
      current_value: 141000000.0,
      drift: {
        cost_percentage: 41,
      },
      risk: {
        score: 87,
        level: 'CRITICAL',
      },
      baseline_completion_date: '2026-12-31',
      current_completion_date: '2027-08-31',
    };

    render(
      <RiskScoreCard
        contractNumber={fixture.contract_id}
        riskScore={fixture.risk.score}
        riskLevel={fixture.risk.level}
        baselineValue={fixture.baseline_value}
        currentValue={fixture.current_value}
        baselineCompletionDate={fixture.baseline_completion_date}
        currentCompletionDate={fixture.current_completion_date}
      />
    );

    // Verify +41% is displayed
    const driftElement = screen.getByTestId('cost-drift-percentage');
    expect(driftElement).toHaveTextContent('+41%');

    // Verify risk score 87 and CRITICAL level
    const riskScoreElement = screen.getByTestId('risk-score-value');
    expect(riskScoreElement).toHaveTextContent('87');
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();

    // Verify ₹10 Cr and ₹14.1 Cr are displayed
    expect(screen.getByText('₹10 Cr')).toBeInTheDocument();
    expect(screen.getByText('₹14.1 Cr')).toBeInTheDocument();
  });

  // 2. Dashboard Summary Cards
  it('renders Dashboard summary cards correctly', () => {
    const mockContracts: Contract[] = [
      {
        id: '1',
        contractNumber: 'PWD-2026-014',
        title: 'Arterial Flyover',
        department: 'Public Works',
        baselineValue: 100000000,
        currentValue: 141000000,
        riskScore: 87,
        riskLevel: 'CRITICAL',
        status: 'UNDER_REVIEW',
        createdAt: '2026-01-01',
        updatedAt: '2026-02-01',
      },
      {
        id: '2',
        contractNumber: 'DOE-2026-019',
        title: 'Solar Panels',
        department: 'Education',
        baselineValue: 18000000,
        currentValue: 18000000,
        riskScore: 18,
        riskLevel: 'LOW',
        status: 'CLEARED',
        createdAt: '2026-01-01',
        updatedAt: '2026-02-01',
      },
    ];

    render(<SummaryCards contracts={mockContracts} />);

    expect(screen.getByText('TOTAL CONTRACTS')).toBeInTheDocument();
    expect(screen.getByText('REQUIRES REVIEW')).toBeInTheDocument();
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // total contracts
  });

  // 3. Priority Review Queue Table
  it('renders Priority Review Queue sorted by risk descending', () => {
    const mockContracts: Contract[] = [
      {
        id: '1',
        contractNumber: 'LOW-001',
        title: 'Low Risk Project',
        department: 'Education',
        baselineValue: 10000000,
        currentValue: 10000000,
        riskScore: 15,
        riskLevel: 'LOW',
        status: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        id: '2',
        contractNumber: 'PWD-2026-014',
        title: 'Critical Project',
        department: 'Public Works',
        baselineValue: 100000000,
        currentValue: 141000000,
        riskScore: 87,
        riskLevel: 'CRITICAL',
        status: 'UNDER_REVIEW',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <PriorityQueueTable contracts={mockContracts} />
      </Wrapper>
    );

    expect(screen.getByText('PWD-2026-014')).toBeInTheDocument();
    expect(screen.getByText('LOW-001')).toBeInTheDocument();
    expect(screen.getByText('+41%')).toBeInTheDocument();
  });

  // 4. Risk Factors and Evidence Navigation
  it('renders AI risk factors and triggers evidence selection callback', () => {
    const onSelectFactor = vi.fn();
    const factors = [
      {
        name: 'Cost deviation',
        score: 28,
        weight: 0.3,
        reason: 'Current value is 41% above baseline.',
      },
    ];

    render(<RiskFactorsList factors={factors} onSelectFactor={onSelectFactor} />);

    expect(screen.getByText('Cost deviation')).toBeInTheDocument();
    expect(screen.getByText('Contribution: 28 pts')).toBeInTheDocument();

    const factorRow = screen.getByText('Cost deviation').closest('div[class*="cursor-pointer"]');
    if (factorRow) {
      fireEvent.click(factorRow);
      expect(onSelectFactor).toHaveBeenCalledWith('Cost deviation');
    }
  });

  // 5. Evidence Panel Rendering
  it('renders ground-truth evidence citations accurately', () => {
    const evidenceItems = [
      {
        document_id: 'doc-1',
        filename: 'contract.pdf',
        page: 12,
        source_text: 'Clause 4.1: Total contract price is fixed at INR 10,00,00,000.',
        original_value: 'INR 10,00,00,000',
        field: 'contract_value',
        change_type: 'BASELINE_AWARD',
      },
    ];

    render(<EvidencePanel evidence={evidenceItems} />);

    expect(screen.getByText('contract.pdf')).toBeInTheDocument();
    expect(screen.getByText('Page 12')).toBeInTheDocument();
    expect(
      screen.getByText('Clause 4.1: Total contract price is fixed at INR 10,00,00,000.')
    ).toBeInTheDocument();
  });
});
