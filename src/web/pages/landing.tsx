import { useLocation } from 'wouter';
import { useState, useEffect, useRef } from 'react';
import AnimatedBackground from '@/components/animated-background';

// Animated counter hook
const useCounter = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!shouldStart) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      countRef.current = Math.floor(end * eased);
      setCount(countRef.current);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, shouldStart]);

  return count;
};

// Voice wave visualization component
const VoiceWaveVisualization = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Central orb */}
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-500/30 animate-glow-pulse" />
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </div>
        
        {/* Pulsing rings */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-violet-500/20"
            style={{
              animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>
      
      {/* Sound wave bars */}
      <div className="flex items-center justify-center gap-1 mt-8">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 bg-gradient-to-t from-violet-500 to-cyan-400 rounded-full"
            style={{
              height: '24px',
              animation: 'sound-wave 1s ease-in-out infinite',
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) => {
  return (
    <div 
      className={`glass-card gradient-border rounded-2xl p-6 animate-fade-in-up opacity-0 stagger-${index + 1} group`}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// Step component for "How It Works"
const Step = ({ number, title, description, isLast }: { number: number; title: string; description: string; isLast?: boolean }) => {
  return (
    <div className="relative flex items-start gap-6">
      {/* Number circle */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <span className="text-2xl font-bold text-white font-display">{number}</span>
        </div>
        {!isLast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-violet-500/50 to-transparent" />
        )}
      </div>
      
      {/* Content */}
      <div className="pt-2 pb-8">
        <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ value, suffix, label, shouldAnimate }: { value: number; suffix: string; label: string; shouldAnimate: boolean }) => {
  const count = useCounter(value, 2000, shouldAnimate);
  
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text font-display mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wide">{label}</div>
    </div>
  );
};

const Landing = () => {
  const [, setLocation] = useLocation();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050208] relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation('/')}>
              <img
                src="./zukii-logo.png"
                alt="Zukii"
                className="h-10 w-auto logo-glow"
              />
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={scrollToFeatures} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Features
              </button>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation('/login')}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
              >
                Login
              </button>
              <button
                onClick={() => setLocation('/signup')}
                className="btn-gradient px-5 py-2 rounded-xl text-white font-semibold text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                Now in Public Beta
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display leading-tight">
                Turn Your Website Into a{' '}
                <span className="gradient-text">Voice AI Agent</span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Zukii scrapes your website, learns your content, and creates an intelligent voice assistant that answers questions about your business - ready to embed in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setLocation('/signup')}
                  className="btn-gradient px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="btn-secondary px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center justify-center gap-2"
                >
                  See How It Works
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right - Visualization */}
            <div className="animate-fade-in-up stagger-2 opacity-0">
              <VoiceWaveVisualization />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-violet-500/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 bg-violet-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              Everything You Need to Build <span className="gradient-text">Voice AI</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From URL to live voice agent in four simple steps. No coding required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              index={0}
              icon={
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
              title="Add Your URL"
              description="Simply paste your website URL and we'll handle the rest. No technical setup needed."
            />
            <FeatureCard
              index={1}
              icon={
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="AI Learns Your Content"
              description="Our AI reads and understands every page, building a comprehensive knowledge base."
            />
            <FeatureCard
              index={2}
              icon={
                <svg className="w-7 h-7 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              }
              title="Voice Agent Ready"
              description="Get a trained voice AI that can answer questions about your business naturally."
            />
            <FeatureCard
              index={3}
              icon={
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              title="Embed Anywhere"
              description="Copy one line of code. Paste it into your site. Done. It's that simple."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              How <span className="gradient-text">Zukii</span> Works
            </h2>
            <p className="text-gray-400 text-lg">
              From website to voice assistant in under 5 minutes
            </p>
          </div>

          <div className="space-y-2">
            <Step
              number={1}
              title="Enter Your Website URL"
              description="Paste your website's URL into the dashboard. Zukii accepts any publicly accessible website."
            />
            <Step
              number={2}
              title="Automatic Content Scraping"
              description="Our intelligent crawler visits every page, extracting and understanding your content, products, services, and FAQs."
            />
            <Step
              number={3}
              title="AI Training Complete"
              description="Within minutes, your custom voice AI agent is trained on your specific content and ready to answer questions."
            />
            <Step
              number={4}
              title="Copy & Embed"
              description="Grab your unique embed code and paste it into your website. The voice widget appears instantly for your visitors."
              isLast
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card gradient-border rounded-3xl p-12">
            <div className="grid md:grid-cols-3 gap-12">
              <StatCard value={10000} suffix="+" label="Websites Powered" shouldAnimate={statsVisible} />
              <StatCard value={1} suffix="M+" label="Conversations" shouldAnimate={statsVisible} />
              <StatCard value={99.9} suffix="%" label="Uptime" shouldAnimate={statsVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-12">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/20" />
            <div className="absolute inset-0 bg-[#050208]/50 backdrop-blur-xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
                Ready to Give Your Website a <span className="gradient-text">Voice</span>?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using Zukii to engage visitors with intelligent voice AI. Start free, upgrade when you're ready.
              </p>
              
              <button
                onClick={() => setLocation('/signup')}
                className="btn-gradient px-10 py-5 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-3 group"
              >
                Start Building Your Voice Agent
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              {/* Embed code preview */}
              <div className="mt-12">
                <p className="text-gray-500 text-sm mb-4">Your embed code will look like this:</p>
                <div className="code-block inline-block px-6 py-3 rounded-xl">
                  <code className="text-violet-300 font-mono text-sm">
                    {'<script src="https://zukii.ai/embed.js" data-agent-id="your-id"></script>'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-violet-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="./zukii-logo.png"
                alt="Zukii"
                className="h-8 w-auto opacity-70"
              />
            </div>

            {/* Links */}
            <div className="flex items-center gap-8">
              <button onClick={scrollToFeatures} className="text-gray-400 hover:text-white transition-colors text-sm">
                Features
              </button>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <button onClick={() => setLocation('/login')} className="text-gray-400 hover:text-white transition-colors text-sm">
                Login
              </button>
              <button onClick={() => setLocation('/signup')} className="text-gray-400 hover:text-white transition-colors text-sm">
                Sign Up
              </button>
            </div>

            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Zukii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for sound wave animation */}
      <style>{`
        @keyframes sound-wave {
          0%, 100% { height: 8px; }
          50% { height: 32px; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
