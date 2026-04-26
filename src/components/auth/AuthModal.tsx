import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User as UserIcon, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setIsLogin(true);
      setEmailError('');
      setPasswordStrength(0);
    }
  }, [isAuthModalOpen]);

  // Real-time password validation
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  // Real-time email validation
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }, [email]);

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email above to reset password.');
      return;
    }
    if (emailError) {
      toast.error('Please fix the email error before resetting password.');
      return;
    }
    
    try {
      setIsLoading(true);
      await resetPassword(email);
      toast.success('Password reset link sent! Check your inbox.');
    } catch (error: any) {
      let message = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || (!isLogin && passwordStrength < 2)) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        toast.success('Welcome back!');
      } else {
        await signUpWithEmail(email, password, name);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      let message = 'An error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'This email is already registered.';
      if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      if (error.code === 'auth/weak-password') message = 'Password is too weak.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      if (error.message !== 'cancelled') {
        toast.error('Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-zinc-500">
              {isLogin ? 'Enter your details to access your resumes.' : 'Start building your professional resume today.'}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label className="text-sm font-medium text-zinc-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-zinc-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none bg-zinc-50 focus:bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none bg-zinc-50 focus:bg-white ${
                      emailError ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 focus:ring-indigo-600'
                    }`}
                    placeholder="you@example.com"
                  />
                  {email && !emailError && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                  )}
                  {emailError && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700">Password</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none bg-zinc-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Password Strength Indicator for Sign Up */}
                {!isLogin && password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= level
                              ? passwordStrength <= 2 ? 'bg-amber-400' : passwordStrength === 3 ? 'bg-blue-400' : 'bg-emerald-500'
                              : 'bg-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {passwordStrength <= 1 && 'Weak - Add numbers and symbols'}
                      {passwordStrength === 2 && 'Fair - Add uppercase letters'}
                      {passwordStrength === 3 && 'Good - Add special characters'}
                      {passwordStrength >= 4 && 'Strong password'}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !!emailError || (!isLogin && passwordStrength < 2)}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-zinc-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>

            <div className="mt-8 text-center text-sm text-zinc-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
