import React from 'react';
import { Bell, ShieldCheck, Building2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { alertsService } from '@/services/alerts.service';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'Dashboard', subtitle }) => {
  const user = authService.getStoredUser();

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts', { unread: true }],
    queryFn: () => alertsService.getAlerts({ unread: true }),
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Department Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{user?.department || 'Public Works Oversight'}</span>
        </div>

        {/* Role Verified Indicator */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{user?.role || 'AUDITOR'}</span>
        </div>

        {/* Notifications Icon */}
        <Link
          to="/alerts"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          title="Audit Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
          )}
        </Link>
      </div>
    </header>
  );
};
