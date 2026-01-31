import { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/store';
import AnimatedBackground from '@/components/animated-background';

const Login = () => {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setLocation('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050208] flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Logo with glow */}
        <div className="flex justify-center mb-10 animate-fade-in-up">
          <div 
            className="relative flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setLocation('/')}
          >
            <img
              src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
              alt="Zukii"
              className="h-16 w-auto logo-glow"
            />
            <span className="text-3xl font-bold text-white font-display gradient-text">Zukii</span>
          </div>
        </div>

        {/* Card with glassmorphism */}
        <div className="glass-card gradient-border rounded-3xl p-8 animate-fade-in-up stagger-1 opacity-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-display">
              Welcome <span className="gradient-text">back</span>
            </h1>
            <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-400 text-sm text-center backdrop-blur-sm animate-scale-in">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-[rgba(45,35,70,0.3)] border-[rgba(139,92,246,0.2)] text-white placeholder:text-gray-500 h-12 rounded-xl input-focus"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[rgba(45,35,70,0.3)] border-[rgba(139,92,246,0.2)] text-white placeholder:text-gray-500 h-12 rounded-xl input-focus"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 btn-gradient text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation('/signup');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors relative group"
              >
                Create one
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8 animate-fade-in-up stagger-2 opacity-0">
          <span className="gradient-text">Voice AI Platform</span> for modern businesses
        </p>
      </div>
    </div>
  );
};

export default Login;
