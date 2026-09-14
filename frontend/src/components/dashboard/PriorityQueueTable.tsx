import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract } from '@/types/contract';
import { formatCurrency, formatDate, getRiskBadgeClasses, getStatusBadgeClasses } from '@/lib/utils';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export interface PriorityQueueTableProps {
  contracts: Contract[];
  isLoading?: boolean;
}

export const PriorityQueueTable: React.FC<PriorityQueueTableProps> = ({
  contracts,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Sort by risk_score descending
  const sortedContracts = [...contracts].sort((a, b) => {
    const scoreA = a.riskScore ?? a.risk_score ?? 0;
    const scoreB = b.riskScore ?? b.risk_score ?? 0;
    return scoreB - scoreA;
  });

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (sortedContracts.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No contracts requiring priority oversight at this time.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            <th className="py-3 px-4">Contract</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4 text-right">Value</th>
            <th className="py-3 px-4 text-right">Cumulative Drift</th>
            <th className="py-3 px-4 text-center">Risk</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Last Updated</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {sortedContracts.map((c) => {
            const num = c.contractNumber || c.contract_number;
            const baseVal = c.baselineValue ?? c.baseline_value ?? 0;
            const currVal = c.currentValue ?? c.current_value ?? baseVal;
            const driftPct =
              baseVal > 0 ? Math.round(((currVal - baseVal) / baseVal) * 100) : 0;
            const riskLevel = c.riskLevel || c.risk_level || 'LOW';
            const riskScore = Math.round(c.riskScore ?? c.risk_score ?? 0);

            return (
              <tr
                key={c.id}
                onClick={() => navigate(`/contracts/${num}`)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 font-semibold text-slate-900 font-mono tracking-tight">
                  {num}
                </td>
                <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate" title={c.title}>
                  {c.title}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-[160px] truncate">
                  {c.department}
                </td>
                <td className="py-3 px-4 text-right font-medium text-slate-900">
                  {formatCurrency(currVal)}
                </td>
                <td className="py-3 px-4 text-right">
                  {driftPct > 0 ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{driftPct}%
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">0%</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeClasses(
                      riskLevel
                    )}`}
                  >
                    {riskLevel} ({riskScore})
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClasses(
                      c.status
                    )}`}
                  >
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-500">
                  {formatDate(c.updatedAt || c.updated_at || c.createdAt || c.created_at)}
                </td>
                <td className="py-3 px-4 text-right">
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
