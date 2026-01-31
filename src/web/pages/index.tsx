import { useLocation } from 'wouter';
import { useAuth } from '@/lib/store';
import { useEffect } from 'react';
import AnimatedBackground from '@/components/animated-background';

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
    <div className="min-h-screen bg-[#050208] flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="text-center relative z-10 animate-fade-in">
        <div className="relative">
          <img
            src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
            alt="Chugli.ai"
            className="h-28 w-auto mx-auto mb-8 animate-glow-pulse logo-glow"
          />
        </div>
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <div className="relative">
            <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-medium">Loading your workspace...</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
