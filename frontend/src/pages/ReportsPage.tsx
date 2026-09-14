import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contractsService } from '@/services/contracts.service';
import { reportsService } from '@/services/reports.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileBarChart, Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export const ReportsPage: React.FC = () => {
  const [selectedContractId, setSelectedContractId] = useState('PWD-2026-014');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: contractsData } = useQuery({
    queryKey: ['contracts', { page_size: 50 }],
    queryFn: () => contractsService.getContracts({ page_size: 50 }),
  });

  const contracts = contractsData?.items || [];
  const activeContract = contracts.find(
    (c) => (c.contractNumber || c.contract_number) === selectedContractId
  );

  const handleDownloadReport = async () => {
    try {
      setIsGenerating(true);
      await reportsService.downloadReport(selectedContractId, selectedContractId);
    } catch (err) {
      alert('Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-slate-700" />
          <span>Executive Oversight & Audit Reporting</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Compile certified PDF audit dossiers incorporating contract baseline, addenda drift, AI evidence citations, and reviewer determinations.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Report Generation Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Select Contract for Dossier Compilation
            </label>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              {contracts.map((c) => {
                const num = c.contractNumber || c.contract_number;
                return (
                  <option key={c.id} value={num}>
                    {num} — {c.title}
                  </option>
                );
              })}
            </select>
          </div>

          {activeContract && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900">
                  {activeContract.contractNumber || activeContract.contract_number}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  Status: {activeContract.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">{activeContract.title}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Department</span>
                  <span className="font-semibold text-slate-700 truncate block">
                    {activeContract.department}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Baseline Value</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(activeContract.baselineValue ?? activeContract.baseline_value)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Current Value</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(activeContract.currentValue ?? activeContract.current_value)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Evaluated Risk</span>
                  <span className="font-bold text-rose-600">
                    {activeContract.riskLevel || activeContract.risk_level || 'LOW'} (
                    {Math.round(activeContract.riskScore ?? activeContract.risk_score ?? 0)}/100)
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              Generates a formal, printable PDF document formatted in accordance with government audit standards.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadReport}
              isLoading={isGenerating}
              className="text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Official PDF Dossier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Included Sections Details */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Standard Dossier Inclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">1. Executive Overview & Identifiers:</strong> Formal reference IDs, department designations, contractor identity, and tender timeline.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">2. Risk Signal Breakdown:</strong> AI calculated factor contributions, weighting schedules, and threshold exceedance reasons.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">3. Version Progression Table:</strong> Chronological ledger of all approved amendments, revised completion dates, and incremental costs.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">4. Material Deviations & Ground-Truth Evidence:</strong> Page numbers, clause citations, and verbatim excerpts.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">5. Auditor Determination & Directives:</strong> Recorded reviewer findings, escalation directives, and verification timestamps.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
