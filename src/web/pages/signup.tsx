import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/store';

const Signup = () => {
  const [, setLocation] = useLocation();
  const { signup, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(name, email, password);
      if (success) {
        setLocation('/dashboard');
      } else {
        setError('Failed to create account');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
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
            gap: '12px',
            marginBottom: '2.5rem',
            cursor: 'pointer'
          }}
        >
          <img
            src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
            alt="Zukii Logo"
            style={{ height: '56px', width: 'auto' }}
          />
          <span 
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Zukii
          </span>
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
              Create your account
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              Start building voice AI agents today
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                htmlFor="name" 
                style={{ 
                  display: 'block', 
                  color: '#D1D5DB', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  marginBottom: '0.5rem' 
                }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
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
                autoComplete="new-password"
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
              <p style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Minimum 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '48px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setLocation('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#22D3EE',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Sign in
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
          By signing up, you agree to our Terms of Service
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

export default Signup;
