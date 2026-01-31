import { useAuth } from '@/lib/store';
import Landing from './landing';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/animated-background';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to check auth state
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        setLocation('/dashboard');
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation]);

  // If authenticated, show loading while redirecting
  if (isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050208] flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative">
            <img
              src="./zukii-logo.png"
              alt="Zukii"
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
  }

  // Show loading spinner briefly while determining auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050208] flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return <Landing />;
};

export default Index;
