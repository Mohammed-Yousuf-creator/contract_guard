import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { authService } from '@/services/auth.service';
import { ShieldCheck, Cpu, Database, Server, Key, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const user = authService.getStoredUser();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Administration & Architecture Status
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Inspect integrated platform microservices, AI analysis endpoints, and authorization context.
        </p>
      </div>

      {/* User Context */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Auditor Session & Credentials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Authenticated Officer</span>
              <span className="font-bold text-slate-900">{user?.full_name || 'Senior Procurement Auditor'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Security Role</span>
              <span className="font-bold text-slate-900">{user?.role || 'AUDITOR'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Department</span>
              <span className="font-bold text-slate-900">{user?.department || 'Public Works Oversight Division'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Microservice Architecture Topology */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Integrated Platform Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Backend Application API</p>
                  <p className="text-[11px] text-slate-500">FastAPI 0.115+ • SQLAlchemy 2.x • Alembic Migrations</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Core AI Analysis Service Adapter</p>
                  <p className="text-[11px] text-slate-500">
                    Mode: <strong className="text-slate-800">MockAIAnalysisClient (Deterministic Synthetic)</strong>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                MOCK_AI_ENABLED
              </span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Storage & Document Vault</p>
                  <p className="text-[11px] text-slate-500">
                    Bucket: <strong className="text-slate-800">contract-documents</strong> • Signed URLs enabled
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                INITIALIZED
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
