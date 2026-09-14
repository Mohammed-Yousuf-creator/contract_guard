import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShieldAlert, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export interface RiskScoreCardProps {
  contractNumber: string;
  riskScore: number | null;
  riskLevel: string | null;
  baselineValue: number | null;
  currentValue: number | null;
  baselineCompletionDate: string | null;
  currentCompletionDate: string | null;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  riskScore = 0,
  riskLevel = 'LOW',
  baselineValue = 0,
  currentValue = 0,
  baselineCompletionDate,
  currentCompletionDate,
}) => {
  const base = baselineValue ?? 0;
  const curr = currentValue ?? base;
  const costDriftPct = base > 0 ? Math.round(((curr - base) / base) * 100) : 0;

  // Calculate schedule drift in months
  let scheduleDriftMonths = 0;
  if (baselineCompletionDate && currentCompletionDate) {
    const d1 = new Date(baselineCompletionDate);
    const d2 = new Date(currentCompletionDate);
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    scheduleDriftMonths = Math.round(diffDays / 30.4);
  }

  const isCritical = riskLevel === 'CRITICAL';
  const isHigh = riskLevel === 'HIGH';

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* 1. Primary Risk Score Gauge */}
        <div className={`p-6 ${isCritical ? 'bg-rose-50/40' : isHigh ? 'bg-orange-50/40' : 'bg-slate-50/40'} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Oversight Risk Score
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isCritical
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : isHigh
                    ? 'bg-orange-100 text-orange-800 border-orange-300'
                    : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                {riskLevel || 'LOW'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span
                data-testid="risk-score-value"
                className={`text-5xl font-black tracking-tight ${
                  isCritical ? 'text-rose-600' : isHigh ? 'text-orange-600' : 'text-slate-900'
                }`}
              >
                {Math.round(riskScore || 0)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Synthesized by AI post-award compliance engine from recorded amendments, invoices, and scope deltas.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Classification: Non-binding decision-support signal</span>
          </div>
        </div>

        {/* 2. Cumulative Cost Drift */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Cumulative Cost Drift</span>
              <span
                data-testid="cost-drift-percentage"
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  costDriftPct > 20
                    ? 'bg-rose-100 text-rose-700'
                    : costDriftPct > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                +{costDriftPct}%
              </span>
            </span>

            <div className="mt-4 flex items-center gap-3">
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase">Baseline Award</p>
                <p className="text-lg font-bold text-slate-700">{formatCurrency(base)}</p>
              </div>
              <span className="text-slate-400 font-bold text-lg">→</span>
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase">Current Valuation</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(curr)}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>
                Net increase of {formatCurrency(curr - base)} across registered revisions
              </span>
            </div>
          </div>

          <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${costDriftPct > 25 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, costDriftPct * 2)}%` }}
            />
          </div>
        </div>

        {/* 3. Schedule Slippage */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Schedule Drift</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  scheduleDriftMonths > 6
                    ? 'bg-rose-100 text-rose-700'
                    : scheduleDriftMonths > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                +{scheduleDriftMonths} months
              </span>
            </span>

            <div className="mt-4 flex items-center gap-3">
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase">Baseline Target</p>
                <p className="text-xs font-bold text-slate-700 font-mono">
                  {formatDate(baselineCompletionDate)}
                </p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase">Revised Target</p>
                <p className="text-xs font-bold text-slate-900 font-mono">
                  {formatDate(currentCompletionDate)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {scheduleDriftMonths > 0
                  ? `Extended delivery by approx. ${scheduleDriftMonths} calendar months`
                  : 'On target with baseline schedule'}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Based on approved milestone addenda and contractor status submittals.
          </p>
        </div>
      </div>
    </Card>
  );
};
