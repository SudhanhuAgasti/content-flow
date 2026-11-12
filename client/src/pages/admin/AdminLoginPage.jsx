import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext.jsx';
import { BrandLogo } from '../../components/common/BrandLogo.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

export const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success('Admin authenticated successfully');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'admin@contentflow.com');
    setValue('password', 'Admin@SecurePass2026!');
    toast.info('Seeded admin credentials populated');
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Radial Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emperor-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-jade-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <BrandLogo size="lg" to="/admin/login" subtitle="Administrator Authentication" />
        </div>

        {/* Login Card */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 shadow-surface-card backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Admin Email Address"
              type="email"
              placeholder="admin@contentflow.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Master Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-obsidian-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-8 pt-6 border-t border-obsidian-800 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="inline-flex items-center gap-2 text-xs font-medium text-emperor-400 hover:text-emperor-300 transition-colors p-2 rounded-lg hover:bg-obsidian-850 border border-transparent hover:border-obsidian-750 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Use Seeded Admin Credentials</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-obsidian-500 font-mono flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-jade-400" />
          <span>HTTP-only JWT &bull; bcrypt Salt Protection &bull; Rate-Limited</span>
        </div>
      </div>
    </div>
  );
};
