import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from './Modal.jsx';
import { Input } from './Input.jsx';
import { Button } from './Button.jsx';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

export const AdminAuthModal = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      triggerError('Please enter both admin email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      toast.success('Admin authentication successful! Access granted.');
      onClose();
      navigate('/admin/dashboard');
    } catch (err) {
      triggerError(err.message || 'Wrong administrator information. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const triggerError = (msg) => {
    setErrorMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const autofillCredentials = () => {
    setEmail('admin@contentflow.com');
    setPassword('Admin@SecurePass2026!');
    setErrorMessage('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Admin authenticated via Google OAuth');
      onClose();
      navigate('/admin/dashboard');
    } catch (err) {
      triggerError(err.message || 'Google OAuth verification failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    triggerError('Google Sign-In was cancelled or failed.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administrative Access Verification" maxWidth="max-w-md">
      <div className={`space-y-5 ${shake ? 'animate-shake' : ''}`}>
        <p className="text-xs text-obsidian-300 leading-relaxed -mt-2">
          This portal requires administrator authorization. Please verify credentials to access the CMS management dashboard.
        </p>

        {/* Shake & Error feedback banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/60 text-xs text-rose-200 flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-bold block text-rose-300">Authentication Failed</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@contentflow.com"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage('');
            }}
            required
          />

          <div className="relative">
            <Input
              label="Admin Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-8 text-obsidian-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full"
              icon={ArrowRight}
            >
              Verify & Enter CMS
            </Button>
          </div>
        </form>

        {/* OAuth Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-obsidian-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-obsidian-900 px-2 text-obsidian-400 font-mono text-[11px]">
              Or OAuth Login
            </span>
          </div>
        </div>

        {/* Google OAuth Component */}
        <div className="flex justify-center">
          {googleLoading ? (
            <div className="py-2 text-xs text-emperor-400 font-mono animate-pulse">
              Verifying Google Account...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              size="medium"
              text="signin_with"
              width="100%"
            />
          )}
        </div>

        {/* Quick helper button */}
        <div className="pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={autofillCredentials}
            className="text-emperor-400 hover:text-emperor-300 font-medium transition-colors"
          >
            Fill Demo Credentials
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-obsidian-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

