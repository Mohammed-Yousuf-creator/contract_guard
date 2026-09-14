import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ShieldAlert, Eye, FileSearch, ArrowRight } from 'lucide-react';
import { Contract } from '@/types/contract';

export interface RecentActivityFeedProps {
  contracts: Contract[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ contracts }) => {
  const navigate = useNavigate();

  // Construct activities from contract states
  const activities = [
    {
      id: 'act-1',
      title: 'Amendment 4 Uploaded & Analyzed',
      contractNumber: 'PWD-2026-014',
      description: 'Revised total valuation recorded at ₹14.1 Cr (+41% drift). Scope expansion and subcontractor novation detected.',
      time: '12 minutes ago',
      icon: UploadCloud,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'act-2',
      title: 'Risk Signal Escalated to CRITICAL',
      contractNumber: 'PWD-2026-014',
      description: 'AI compliance engine updated risk evaluation to 87/100 following cumulative cost and schedule variance.',
      time: '15 minutes ago',
      icon: ShieldAlert,
      color: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'act-3',
      title: 'Contract Flagged Under Review',
      contractNumber: 'MOH-2026-003',
      description: 'Senior auditor initiated detailed audit examination for HVAC price variance.',
      time: '1 hour ago',
      icon: Eye,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'act-4',
      title: 'New Supporting Evidence Indexed',
      contractNumber: 'DOT-2025-108',
      description: 'CBTC signalling specification citations extracted from addendum schedule 2.',
      time: '3 hours ago',
      icon: FileSearch,
      color: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="divide-y divide-slate-100">
      {activities.map((act) => {
        const Icon = act.icon;
        return (
          <div
            key={act.id}
            onClick={() => navigate(`/contracts/${act.contractNumber}`)}
            className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5 cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {act.title}
                </p>
                <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Target: <span className="font-semibold text-slate-700">{act.contractNumber}</span>
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0 self-center transition-colors" />
          </div>
        );
      })}
    </div>
  );
};
