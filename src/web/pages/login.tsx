import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/store';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

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

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const success = await loginWithGoogle();
      if (success) {
        setLocation('/dashboard');
      } else {
        setError('Google sign in failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050208 0%, #0a0514 50%, #050208 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative'
      }}
    >
      {/* Simple animated background */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div 
          onClick={() => setLocation('/')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2.5rem',
            cursor: 'pointer'
          }}
        >
          <img
            src="./zukii-brand-logo.png"
            alt="Zukii Logo"
            style={{ 
              height: '140px', 
              width: 'auto',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
            }}
          />
        </div>

        {/* Card */}
        <div 
          style={{
            background: 'rgba(20, 15, 35, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              color: 'white', 
              marginBottom: '0.5rem',
              fontFamily: 'Syne, sans-serif'
            }}>
              Welcome back
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div 
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#f87171',
                fontSize: '0.875rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}
            >
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            style={{
              width: '100%',
              height: '48px',
              background: 'white',
              border: 'none',
              borderRadius: '12px',
              color: '#374151',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: (isGoogleLoading || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (isGoogleLoading || isLoading) ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              if (!isGoogleLoading && !isLoading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
          >
            {isGoogleLoading ? (
              <>
                <svg 
                  style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <circle 
                    style={{ opacity: 0.25 }} 
                    cx="12" cy="12" r="10" 
                    stroke="#6B7280" 
                    strokeWidth="4" 
                  />
                  <path 
                    style={{ opacity: 0.75 }} 
                    fill="#6B7280" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                  />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '1.5rem 0'
            }}
          >
            <div 
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)'
              }}
            />
            <span 
              style={{
                color: '#6B7280',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
            >
              or continue with email
            </span>
            <div 
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)'
              }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  color: '#D1D5DB', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  marginBottom: '0.5rem' 
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  background: 'rgba(30, 25, 50, 0.8)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8B5CF6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  color: '#D1D5DB', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  marginBottom: '0.5rem' 
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  background: 'rgba(30, 25, 50, 0.8)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8B5CF6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              style={{
                width: '100%',
                height: '48px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: (isLoading || isGoogleLoading) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || isGoogleLoading) ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? (
                <>
                  <svg 
                    style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <circle 
                      style={{ opacity: 0.25 }} 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                    />
                    <path 
                      style={{ opacity: 0.75 }} 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setLocation('/signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#22D3EE',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Create one
              </button>
            </p>
          </div>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: '#6B7280', 
          fontSize: '0.75rem', 
          marginTop: '2rem' 
        }}>
          Voice AI Platform for modern businesses
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #6B7280;
        }
      `}</style>
    </div>
  );
};

export default Login;
