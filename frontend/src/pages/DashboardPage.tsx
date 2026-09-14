import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contractsService } from '@/services/contracts.service';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { PriorityQueueTable } from '@/components/dashboard/PriorityQueueTable';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    data: contractsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['contracts', { page_size: 50 }],
    queryFn: () => contractsService.getContracts({ page_size: 50 }),
  });

  const contracts = contractsData?.items || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Procurement Audit & Oversight Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance surveillance, post-award drift analytics, and human determination queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Signals
          </Button>

          <Link to="/upload">
            <Button variant="primary" size="sm" className="text-xs">
              Upload Addenda
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Summary Cards */}
      <SummaryCards contracts={contracts} isLoading={isLoading} />

      {/* Priority Review Queue Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Priority Review Queue</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked in descending order of AI calculated risk score. Click any row to inspect ground-truth evidence.
            </p>
          </div>
          <Link
            to="/contracts"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <span>View All Contracts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <PriorityQueueTable contracts={contracts} isLoading={isLoading} />
      </Card>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Compliance Activity & Oversight Events</CardTitle>
            </CardHeader>
            <RecentActivityFeed contracts={contracts} />
          </Card>
        </div>

        <div>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Regulatory Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>Decision-Support Policy:</strong> Contract Guard synthesizes contract addenda
                and notifies officers of material variances. It does not issue legal determinations or
                automate punitive actions.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] space-y-1">
                <p className="font-semibold uppercase tracking-wider">Mandatory Thresholds</p>
                <p>• Cost deviation &gt; 25% requires formal Auditor Determination.</p>
                <p>• Schedule slippage &gt; 180 days triggers oversight panel notification.</p>
                <p>• Tier-1 Novation requires authenticated vendor compliance certs.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
