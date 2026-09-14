import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 icon-text-blue-600',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 icon-text-emerald-600',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 icon-text-amber-600',
    danger: 'bg-rose-50 border-rose-200 text-rose-800 icon-text-rose-600',
  };

  const icons = {
    info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
    danger: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        'border rounded-md p-3.5 flex items-start gap-3 text-xs leading-relaxed',
        styles[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1">
        {title && <p className="font-semibold uppercase tracking-wider mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
