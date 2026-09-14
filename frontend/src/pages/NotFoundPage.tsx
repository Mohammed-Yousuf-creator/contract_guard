import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">404 — Registry Record Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested procurement oversight route or document does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="sm">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
