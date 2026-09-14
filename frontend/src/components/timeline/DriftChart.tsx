import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ContractVersion } from '@/types/change';

export interface DriftChartProps {
  versions: ContractVersion[];
  baselineValue: number | null;
}

export const DriftChart: React.FC<DriftChartProps> = ({ versions, baselineValue }) => {
  const chartData = versions.map((v) => ({
    name: v.version_number === 0 ? 'Baseline' : `Amd ${v.version_number}`,
    version: v.version_number,
    value: v.contract_value ? v.contract_value / 10000000 : 0, // in Crores
    baseline: baselineValue ? baselineValue / 10000000 : 0,
    completion: v.completion_date || '—',
  }));

  if (chartData.length <= 1) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Multiple version snapshots required to render cumulative drift curve.
      </div>
    );
  }

  return (
    <div className="w-full h-72 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            dy={8}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `₹${v} Cr`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs space-y-1">
                    <p className="font-bold border-b border-slate-700 pb-1">{data.name}</p>
                    <p className="text-amber-400">
                      Valuation: <span className="font-semibold text-white">₹{data.value.toFixed(2)} Cr</span>
                    </p>
                    <p className="text-slate-400">
                      Baseline: ₹{data.baseline.toFixed(2)} Cr
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      Target Completion: {data.completion}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            y={baselineValue ? baselineValue / 10000000 : 0}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: 'Baseline Award', fill: '#64748b', fontSize: 10, position: 'insideBottomRight' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Contract Value"
            stroke="#e11d48"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#e11d48', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
