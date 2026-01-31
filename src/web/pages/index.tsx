import { useLocation } from 'wouter';
import { useAuth } from '@/lib/store';
import { useEffect } from 'react';

const Index = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    } else {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  // Show a brief loading state while redirecting
  return (
    <div className="min-h-screen bg-[#0F0D1A] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <img
          src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
          alt="Chugli.ai"
          className="h-24 w-auto mx-auto mb-6 animate-pulse-glow"
        />
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
