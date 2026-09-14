import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 shadow-md mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
          Contract Guard
        </h1>
        <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider">
          Post-Award Contract Oversight & Compliance System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-slate-200 sm:px-10">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Internal Government Oversight Portal • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};
