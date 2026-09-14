import React from 'react';
import { ContractVersion } from '@/types/change';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileCheck, Calendar, DollarSign, ArrowDown, GitCommit } from 'lucide-react';
import { DriftChart } from './DriftChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface ContractTimelineProps {
  versions: ContractVersion[];
  baselineValue: number | null;
}

export const ContractTimeline: React.FC<ContractTimelineProps> = ({
  versions = [],
  baselineValue,
}) => {
  // Sort versions ascending
  const sortedVersions = [...versions].sort((a, b) => a.version_number - b.version_number);

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Cumulative Valuation Progression Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <DriftChart versions={sortedVersions} baselineValue={baselineValue} />
        </CardContent>
      </Card>

      {/* Timeline Steps */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Chronological Version Registry & Addenda Chain</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8">
            {sortedVersions.map((v, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === sortedVersions.length - 1;
              const label =
                v.version_number === 0
                  ? 'Baseline Tender Award'
                  : `Amendment ${v.version_number}`;

              const base = baselineValue || 0;
              const currVal = v.contract_value || 0;
              const variance = currVal - base;
              const pct = base > 0 ? Math.round((variance / base) * 100) : 0;

              return (
                <div key={v.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isLast
                        ? 'bg-rose-600 border-rose-200 text-white'
                        : isFirst
                        ? 'bg-slate-900 border-slate-200 text-white'
                        : 'bg-white border-slate-400 text-slate-600'
                    }`}
                  >
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 transition-all hover:bg-slate-50 hover:shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                          {label}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          v{v.version_number}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(v.contract_value)}
                        </span>
                        {!isFirst && pct !== 0 && (
                          <span
                            className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                              pct > 20
                                ? 'bg-rose-100 text-rose-700'
                                : pct > 0
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {pct > 0 ? `+${pct}%` : `${pct}%`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Target Completion
                        </span>
                        <span className="font-medium text-slate-700">
                          {formatDate(v.completion_date) || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Contractor / Lead Subcontractor
                        </span>
                        <span className="font-medium text-slate-700">
                          {v.contractor || (v.subcontractors ? JSON.stringify(v.subcontractors) : 'Standard consortium')}
                        </span>
                      </div>
                    </div>

                    {v.scope && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Major Scope Revisions & Addendum Terms
                        </span>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{v.scope}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
