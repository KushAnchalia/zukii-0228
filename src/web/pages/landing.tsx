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
      const eased = 1 - Math.pow(1 - progress, 4);
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

// Enhanced Voice Wave Visualization - Much bigger and more dramatic
const VoiceWaveVisualization = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto scale-110 lg:scale-125">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-400/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Central orb - BIGGER */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Outer glow rings */}
        <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-violet-500/10 to-cyan-500/10 blur-2xl animate-pulse" />
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet-600/15 to-fuchsia-500/15 blur-xl" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }} />
        
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20" style={{ animation: 'breathe 4s ease-in-out infinite' }} />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-500/30" style={{ animation: 'breathe 4s ease-in-out infinite 0.5s' }} />
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-violet-500/50">
          <svg className="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </div>
        
        {/* Pulsing rings - MORE of them */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-violet-500/30"
            style={{
              animation: `ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Sound wave bars - MORE bars, taller */}
      <div className="flex items-center justify-center gap-1.5 mt-12">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-violet-500 via-fuchsia-500 to-cyan-400 rounded-full"
            style={{
              width: '4px',
              height: '32px',
              animation: 'sound-wave-dramatic 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.06}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating circles */}
      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 opacity-60" style={{ animation: 'float-circle 6s ease-in-out infinite' }} />
      <div className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 opacity-40" style={{ animation: 'float-circle 8s ease-in-out infinite 1s' }} />
      <div className="absolute top-1/4 -left-12 w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-cyan-500 opacity-50" style={{ animation: 'float-circle 5s ease-in-out infinite 0.5s' }} />
    </div>
  );
};

// Enhanced Feature card with better hover effects
const FeatureCard = ({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) => {
  return (
    <div 
      className={`relative glass-card rounded-2xl p-8 animate-fade-in-up opacity-0 stagger-${index + 1} group overflow-hidden`}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/0 via-cyan-500/0 to-fuchsia-500/0 group-hover:from-violet-500/50 group-hover:via-cyan-500/30 group-hover:to-fuchsia-500/50 transition-all duration-500" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-cyan-500/0 group-hover:from-violet-500/10 group-hover:to-cyan-500/10 transition-all duration-500 rounded-2xl" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-violet-500/20">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-violet-200 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
      </div>
    </div>
  );
};

// Step component for "How It Works"
const Step = ({ number, title, description, isLast }: { number: number; title: string; description: string; isLast?: boolean }) => {
  return (
    <div className="relative flex items-start gap-8 group">
      {/* Number circle */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-violet-500/40 group-hover:scale-110 group-hover:shadow-violet-500/60 transition-all duration-300">
          <span className="text-3xl font-bold text-white font-display">{number}</span>
        </div>
        {!isLast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-28 bg-gradient-to-b from-violet-500/60 via-fuchsia-500/30 to-transparent rounded-full" />
        )}
      </div>
      
      {/* Content */}
      <div className="pt-4 pb-12">
        <h3 className="text-2xl font-bold text-white mb-3 font-display group-hover:text-violet-200 transition-colors">{title}</h3>
        <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ value, suffix, label, shouldAnimate }: { value: number; suffix: string; label: string; shouldAnimate: boolean }) => {
  const count = useCounter(value, 2000, shouldAnimate);
  
  return (
    <div className="text-center group">
      <div className="text-5xl md:text-6xl font-bold gradient-text font-display mb-3 group-hover:scale-110 transition-transform">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-widest">{label}</div>
    </div>
  );
};

// Testimonial Card
const TestimonialCard = ({ quote, name, role, company, delay }: { quote: string; name: string; role: string; company: string; delay: number }) => {
  return (
    <div 
      className="glass-card rounded-2xl p-8 animate-fade-in-up opacity-0 group hover:scale-[1.02] transition-transform duration-300"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {/* Quote mark */}
      <div className="text-6xl text-violet-500/30 font-serif leading-none mb-4">"</div>
      <p className="text-gray-300 text-lg mb-6 leading-relaxed">{quote}</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-white font-semibold">{name}</div>
          <div className="text-gray-500 text-sm">{role}, {company}</div>
        </div>
      </div>
    </div>
  );
};

// Pricing Card
const PricingCard = ({ name, price, period, description, features, popular, delay }: { 
  name: string; 
  price: string; 
  period: string; 
  description: string; 
  features: string[]; 
  popular?: boolean;
  delay: number;
}) => {
  const [, setLocation] = useLocation();
  
  return (
    <div 
      className={`relative glass-card rounded-3xl p-8 animate-fade-in-up opacity-0 ${popular ? 'border-2 border-violet-500/50 scale-105' : ''}`}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-white text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 font-display">{name}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold gradient-text font-display">{price}</span>
          <span className="text-gray-400">{period}</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-300">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => setLocation('/signup')}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          popular 
            ? 'btn-gradient text-white' 
            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
        }`}
      >
        Get Started
      </button>
    </div>
  );
};

// Demo Widget Preview
const WidgetDemo = () => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(a => !a);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-violet-500/20">
        <div className="bg-[#0a0612] rounded-[2.5rem] overflow-hidden aspect-[9/16]">
          {/* Mock website content */}
          <div className="p-6 space-y-4">
            <div className="h-4 w-24 bg-gray-800 rounded" />
            <div className="h-32 bg-gray-800/50 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-800 rounded" />
              <div className="h-3 w-4/5 bg-gray-800 rounded" />
              <div className="h-3 w-3/5 bg-gray-800 rounded" />
            </div>
          </div>
          
          {/* Floating widget */}
          <div className="absolute bottom-8 right-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <svg className={`w-8 h-8 text-white transition-transform duration-300 ${isActive ? 'scale-125' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
            {/* Ripple effect */}
            {isActive && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/50 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/30 animate-ping" style={{ animationDelay: '0.3s' }} />
              </>
            )}
          </div>
          
          {/* Chat bubble */}
          <div className={`absolute bottom-28 right-4 max-w-[200px] transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gradient-to-br from-violet-500/90 to-fuchsia-500/90 backdrop-blur-sm rounded-2xl rounded-br-sm p-4 text-white text-sm shadow-xl">
              Hi! I'm your AI assistant. How can I help you today?
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -z-10 -top-8 -left-8 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute -z-10 -bottom-8 -right-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
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

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050208] relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Extra floating elements throughout the page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-violet-400/40" style={{ animation: 'float-slow 20s ease-in-out infinite' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-cyan-400/30" style={{ animation: 'float-slow 25s ease-in-out infinite 5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-fuchsia-400/40" style={{ animation: 'float-slow 22s ease-in-out infinite 2s' }} />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-violet-400/50" style={{ animation: 'float-slow 18s ease-in-out infinite 8s' }} />
      </div>
      
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setLocation('/')}>
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt=""
                className="h-9 w-auto logo-glow group-hover:scale-110 transition-transform"
              />
              <span className="text-xl font-bold text-white font-display gradient-text">Zukii</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={scrollToFeatures} className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:scale-105">
                Features
              </button>
              <button onClick={scrollToHowItWorks} className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:scale-105">
                How It Works
              </button>
              <button onClick={scrollToPricing} className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:scale-105">
                Pricing
              </button>
            </div>

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

      {/* Hero Section - More dramatic */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8 hover:bg-violet-500/20 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                🎉 Now in Public Beta — Start Free Today
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 font-display leading-[1.1]">
                Turn Your Website Into a{' '}
                <span className="gradient-text relative">
                  Voice AI Agent
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 2 150 6C200 10 250 8 298 4" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop stopColor="#8B5CF6"/>
                        <stop offset="0.5" stopColor="#22D3EE"/>
                        <stop offset="1" stopColor="#F472B6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Zukii scrapes your website, learns your content, and creates an intelligent voice assistant that answers questions about your business — ready to embed in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setLocation('/signup')}
                  className="btn-gradient px-10 py-5 rounded-2xl text-white font-semibold text-lg inline-flex items-center justify-center gap-3 group shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                >
                  Get Started Free
                  <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="btn-secondary px-10 py-5 rounded-2xl text-white font-semibold text-lg inline-flex items-center justify-center gap-3"
                >
                  See How It Works
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Setup in 5 minutes
                </div>
              </div>
            </div>

            {/* Right - Visualization */}
            <div className="animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <VoiceWaveVisualization />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-8 h-12 rounded-full border-2 border-violet-500/40 flex items-start justify-center p-2">
            <div className="w-2 h-3 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Demo Section - NEW */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <WidgetDemo />
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
                See It In <span className="gradient-text">Action</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Your visitors get an intelligent voice assistant that knows everything about your business. They click, they ask, they get answers instantly.
              </p>
              <ul className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
                {[
                  "Natural conversation flow",
                  "Answers from your actual content",
                  "Works on any device",
                  "Customizable look & feel"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              Everything You Need to Build <span className="gradient-text">Voice AI</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From URL to live voice agent in four simple steps. No coding required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              index={0}
              icon={
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
              title="Add Your URL"
              description="Simply paste your website URL and we'll handle the rest. No technical setup needed."
            />
            <FeatureCard
              index={1}
              icon={
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="AI Learns Your Content"
              description="Our AI reads and understands every page, building a comprehensive knowledge base."
            />
            <FeatureCard
              index={2}
              icon={
                <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              }
              title="Voice Agent Ready"
              description="Get a trained voice AI that can answer questions about your business naturally."
            />
            <FeatureCard
              index={3}
              icon={
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              How <span className="gradient-text">Zukii</span> Works
            </h2>
            <p className="text-xl text-gray-400">
              From website to voice assistant in under 5 minutes
            </p>
          </div>

          <div className="space-y-4">
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

      {/* Testimonials Section - NEW */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              Loved by <span className="gradient-text">Businesses</span>
            </h2>
            <p className="text-xl text-gray-400">
              See what our customers are saying
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Zukii transformed how we handle customer questions. Our support team now focuses on complex issues while the AI handles the basics perfectly."
              name="Sarah Chen"
              role="Head of Support"
              company="TechFlow"
              delay={0.1}
            />
            <TestimonialCard
              quote="Setup took literally 5 minutes. Within an hour, our website had a voice assistant that knew everything about our products. Mind-blowing."
              name="Marcus Johnson"
              role="Founder"
              company="StartupHub"
              delay={0.2}
            />
            <TestimonialCard
              quote="The accuracy is incredible. It answers questions I didn't even know were on our website. Our conversion rate went up 23% in the first month."
              name="Emma Williams"
              role="Marketing Director"
              company="GrowthCo"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card gradient-border rounded-3xl p-16">
            <div className="grid md:grid-cols-3 gap-16">
              <StatCard value={10000} suffix="+" label="Websites Powered" shouldAnimate={statsVisible} />
              <StatCard value={1} suffix="M+" label="Conversations" shouldAnimate={statsVisible} />
              <StatCard value={99.9} suffix="%" label="Uptime" shouldAnimate={statsVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <PricingCard
              name="Free"
              price="$0"
              period="/month"
              description="Perfect for getting started"
              features={[
                "1 website",
                "1,000 conversations/mo",
                "Basic voice AI",
                "Community support",
                "Zukii branding"
              ]}
              delay={0.1}
            />
            <PricingCard
              name="Pro"
              price="$49"
              period="/month"
              description="For growing businesses"
              features={[
                "5 websites",
                "10,000 conversations/mo",
                "Advanced voice AI",
                "Priority support",
                "Remove branding",
                "Analytics dashboard",
                "Custom styling"
              ]}
              popular
              delay={0.2}
            />
            <PricingCard
              name="Enterprise"
              price="$199"
              period="/month"
              description="For large organizations"
              features={[
                "Unlimited websites",
                "Unlimited conversations",
                "Premium voice AI",
                "Dedicated support",
                "White-label solution",
                "Advanced analytics",
                "API access",
                "SLA guarantee"
              ]}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-cyan-500/30" />
            <div className="absolute inset-0 bg-[#050208]/40 backdrop-blur-xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
                Ready to Give Your Website a <span className="gradient-text">Voice</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses using Zukii to engage visitors with intelligent voice AI. Start free, upgrade when you're ready.
              </p>
              
              <button
                onClick={() => setLocation('/signup')}
                className="btn-gradient px-12 py-6 rounded-2xl text-white font-semibold text-xl inline-flex items-center gap-4 group shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
              >
                Start Building Your Voice Agent
                <svg className="w-7 h-7 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <div className="mt-12">
                <p className="text-gray-500 text-sm mb-4">Your embed code will look like this:</p>
                <div className="code-block inline-block px-8 py-4 rounded-xl">
                  <code className="text-violet-300 font-mono">
                    {'<script src="https://zukii.ai/embed.js" data-agent-id="your-id"></script>'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-violet-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-100 transition-opacity group"
              onClick={() => setLocation('/')}
            >
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt=""
                className="h-10 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-xl font-bold text-white/70 font-display group-hover:text-white transition-colors">Zukii</span>
            </div>

            <div className="flex items-center gap-8">
              <button onClick={scrollToFeatures} className="text-gray-400 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={scrollToPricing} className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </button>
              <button onClick={() => setLocation('/login')} className="text-gray-400 hover:text-white transition-colors">
                Login
              </button>
              <button onClick={() => setLocation('/signup')} className="text-gray-400 hover:text-white transition-colors">
                Sign Up
              </button>
            </div>

            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Zukii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes sound-wave-dramatic {
          0%, 100% { height: 8px; }
          50% { height: 48px; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        @keyframes float-circle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(20px); }
          50% { transform: translateY(-10px) translateX(-20px); }
          75% { transform: translateY(-40px) translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
