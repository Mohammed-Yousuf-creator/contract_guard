import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Contract } from '@/types/contract';
import { FileText, Eye, AlertTriangle, ShieldAlert } from 'lucide-react';

export interface SummaryCardsProps {
  contracts: Contract[];
  isLoading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ contracts, isLoading = false }) => {
  const totalContracts = contracts.length;
  const requiresReview = contracts.filter(
    (c) => c.status === 'UNDER_REVIEW' || c.status === 'ESCALATED'
  ).length;
  const highRisk = contracts.filter((c) => c.riskLevel === 'HIGH' || c.risk_level === 'HIGH').length;
  const criticalRisk = contracts.filter(
    (c) => c.riskLevel === 'CRITICAL' || c.risk_level === 'CRITICAL'
  ).length;

  const cards = [
    {
      label: 'TOTAL CONTRACTS',
      value: totalContracts,
      subtext: 'Active oversight portfolio',
      icon: FileText,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      label: 'REQUIRES REVIEW',
      value: requiresReview,
      subtext: 'Auditor determination pending',
      icon: Eye,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'HIGH RISK',
      value: highRisk,
      subtext: 'Material variance detected',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'CRITICAL',
      value: criticalRisk,
      subtext: 'Urgent compliance signal',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white border border-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="border-slate-200 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{card.subtext}</p>
              </div>
              <div className={`w-11 h-11 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
