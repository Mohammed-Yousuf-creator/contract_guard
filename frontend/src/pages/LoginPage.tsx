import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/Alert';
import { ShieldCheck, Lock, UserCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid government email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'auditor@contractguard.gov',
      password: 'AuditGuard2026!',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      await authService.login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (role: 'auditor' | 'admin') => {
    if (role === 'auditor') {
      setValue('email', 'auditor@contractguard.gov');
      setValue('password', 'AuditGuard2026!');
    } else {
      setValue('email', 'admin@contractguard.gov');
      setValue('password', 'AdminGuard2026!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Official Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">
          Access the post-award procurement audit and compliance verification terminal.
        </p>
      </div>

      {authError && (
        <AlertBanner type="danger" title="Access Denied">
          {authError}
        </AlertBanner>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Government Email"
          type="email"
          placeholder="officer@contractguard.gov"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password / Security Credential"
          type="password"
          placeholder="••••••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          <Lock className="w-4 h-4 mr-2" />
          Sign In to Audit Terminal
        </Button>
      </form>

      {/* Demo Credentials Switcher */}
      <div className="pt-4 border-t border-slate-200">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Demo Environment Quick Access:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials('auditor')}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left text-xs transition-colors"
          >
            <span className="font-semibold block text-slate-800">Lead Auditor</span>
            <span className="text-[10px] text-slate-500">auditor@contractguard.gov</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('admin')}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left text-xs transition-colors"
          >
            <span className="font-semibold block text-slate-800">System Admin</span>
            <span className="text-[10px] text-slate-500">admin@contractguard.gov</span>
          </button>
        </div>
      </div>
    </div>
  );
};
