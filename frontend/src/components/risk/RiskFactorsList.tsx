import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RiskFactor } from '@/types/risk';
import { ChevronRight, FileSearch, AlertTriangle } from 'lucide-react';

export interface RiskFactorsListProps {
  factors: RiskFactor[];
  onSelectFactor?: (factorName: string) => void;
}

export const RiskFactorsList: React.FC<RiskFactorsListProps> = ({
  factors = [],
  onSelectFactor,
}) => {
  if (factors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Identified Risk Signals & Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500">No adverse risk factors signaled by the Core AI engine.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Identified Risk Signals & Factor Breakdown</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any factor to inspect supporting document citations and textual evidence.
          </p>
        </div>
        <span className="text-xs text-slate-400 uppercase font-semibold">
          {factors.length} active signals
        </span>
      </CardHeader>
      <div className="divide-y divide-slate-100">
        {factors.map((factor) => {
          return (
            <div
              key={factor.name}
              onClick={() => onSelectFactor && onSelectFactor(factor.name)}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    {factor.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Contribution: {factor.score} pts
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    (Weight: {Math.round(factor.weight * 100)}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{factor.reason}</p>
              </div>

              <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-800 transition-colors shrink-0">
                <span className="hidden sm:inline text-xs font-medium text-slate-500 group-hover:text-slate-800">
                  Inspect Evidence
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
