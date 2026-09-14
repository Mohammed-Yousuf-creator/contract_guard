import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService, AlertFilterParams } from '@/services/alerts.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTime, getRiskBadgeClasses } from '@/lib/utils';
import { Bell, Check, ArrowRight, ShieldAlert, Filter, RefreshCw } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [unreadOnly, setUnreadOnly] = useState<boolean | undefined>(undefined);
  const [riskFilter, setRiskFilter] = useState<string>('');

  const filterParams: AlertFilterParams = {
    unread: unreadOnly,
    risk_level: riskFilter || undefined,
  };

  const { data: alerts = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['alerts', filterParams],
    queryFn: () => alertsService.getAlerts(filterParams),
  });

  const markReadMutation = useMutation({
    mutationFn: (alertId: string) => alertsService.markAsRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700" />
            <span>Compliance Alert Feed</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications emitted when contracts trigger high or critical risk thresholds.
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
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-200">
        <CardContent className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Filters:</span>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setUnreadOnly(undefined)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  unreadOnly === undefined
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Alerts
              </button>
              <button
                onClick={() => setUnreadOnly(true)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  unreadOnly === true
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread Only
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="">All Risk Tiers</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Feed */}
      <Card className="border-slate-200 shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No compliance alerts found for the selected filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => {
              const isUnread = !alert.read;
              return (
                <div
                  key={alert.id}
                  className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                    isUnread ? 'bg-amber-50/20' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClasses(
                          alert.risk_level
                        )}`}
                      >
                        {alert.risk_level}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/contracts/${alert.contract_number || alert.contract_id}`)
                          }
                          className="font-mono font-bold text-xs text-slate-900 hover:underline hover:text-blue-600 transition-colors"
                        >
                          {alert.contract_number || alert.contract_id}
                        </button>
                        {alert.contract_title && (
                          <span className="text-xs text-slate-500 truncate hidden md:inline">
                            — {alert.contract_title}
                          </span>
                        )}
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {alert.message}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1.5">
                        Recorded: {formatDateTime(alert.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markReadMutation.mutate(alert.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                        title="Mark as Read"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Mark Read
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/contracts/${alert.contract_number || alert.contract_id}`)
                      }
                      className="text-[11px]"
                    >
                      <span>Examine</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
