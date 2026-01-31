import { useLocation } from 'wouter';
import { useState, useEffect, useRef } from 'react';

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

// Voice Orb Visualization - Cleaner design matching reference
const VoiceOrb = () => {
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
      
      {/* Multiple pulsing rings */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-violet-500/20"
          style={{
            animation: `pulse-ring 3s ease-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
      
      {/* Main orb */}
      <div className="absolute inset-12 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800 shadow-2xl shadow-violet-500/50">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
        
        {/* Microphone icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </div>
      </div>
      
      {/* Sound wave bars around orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center gap-1">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-cyan-400 to-violet-400 rounded-full w-1"
            style={{
              height: `${12 + Math.random() * 20}px`,
              animation: `sound-bar 1s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Phone Mockup with chat interface
const PhoneMockup = () => {
  return (
    <div className="relative w-64 mx-auto">
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-2 border border-gray-700">
        {/* Screen */}
        <div className="bg-[#0a0815] rounded-[2rem] overflow-hidden" style={{ aspectRatio: '9/19' }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-2 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3/4 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>
          
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
              <div>
                <div className="text-white text-sm font-medium">Zukii Assistant</div>
                <div className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="p-4 space-y-3">
            {/* Bot message */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0" />
              <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                <p className="text-white text-xs">Hi! I'm your AI assistant. How can I help you today?</p>
              </div>
            </div>
            
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-violet-600 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                <p className="text-white text-xs">What products do you offer?</p>
              </div>
            </div>
            
            {/* Bot response */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0" />
              <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                <p className="text-white text-xs">We offer a variety of AI-powered tools including...</p>
              </div>
            </div>
          </div>
          
          {/* Voice button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reflection glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-[3rem] blur-2xl -z-10" />
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="group relative bg-[#0d0a14] rounded-xl p-6 border border-gray-800/50 hover:border-violet-500/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Timeline step component
const TimelineStep = ({ number, title, description, isLast }: { number: number; title: string; description: string; isLast?: boolean }) => {
  return (
    <div className="flex gap-6">
      {/* Line and circle */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30">
          {number}
        </div>
        {!isLast && (
          <div className="w-0.5 h-20 bg-gradient-to-b from-violet-500/50 to-violet-500/10 mt-2" />
        )}
      </div>
      
      {/* Content */}
      <div className="pb-8">
        <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
  );
};

// Testimonial card
const TestimonialCard = ({ quote, name, role, initial }: { quote: string; name: string; role: string; initial: string }) => {
  return (
    <div className="bg-[#0d0a14] rounded-xl p-6 border border-gray-800/50">
      <p className="text-gray-400 text-sm leading-relaxed mb-6">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
          {initial}
        </div>
        <div>
          <div className="text-white font-medium text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
};

// Stat card
const StatCard = ({ value, suffix, label, shouldAnimate }: { value: number; suffix: string; label: string; shouldAnimate: boolean }) => {
  const count = useCounter(value, 2000, shouldAnimate);
  
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
};

// Pricing card
const PricingCard = ({ name, price, features, popular, onGetStarted }: { 
  name: string; 
  price: string; 
  features: string[]; 
  popular?: boolean;
  onGetStarted: () => void;
}) => {
  return (
    <div className={`relative bg-[#0d0a14] rounded-2xl p-6 border ${popular ? 'border-violet-500/50' : 'border-gray-800/50'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-white text-xs font-medium">
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-gray-400 text-sm mb-2">{name}</h3>
        <div className="text-4xl font-bold text-white">
          {price}
          <span className="text-gray-500 text-base font-normal">/month</span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <button
        onClick={onGetStarted}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          popular 
            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
      >
        Get Started
      </button>
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050208] text-white">
      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050208]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setLocation('/')}
            >
              <img
                src="./zukii-brand-logo.png"
                alt="Zukii"
                className="h-10 w-auto"
              />
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Pricing
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation('/login')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Login
              </button>
              <button
                onClick={() => setLocation('/signup')}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              {/* Beta badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                </span>
                🎉 Now in Public Beta — Start Free Today
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Turn Your Website Into a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                  Voice AI Agent
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                Zukii scrapes your website, learns your content, and creates an intelligent voice assistant that answers questions about your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => setLocation('/signup')}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-4 rounded-xl text-white font-semibold border border-gray-700 hover:bg-gray-800/50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  See How It Works
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6 justify-center lg:justify-start text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Setup in 5 minutes
                </div>
              </div>
            </div>

            {/* Right - Voice orb visualization */}
            <div className="flex items-center justify-center">
              <VoiceOrb />
            </div>
          </div>
        </div>
      </section>

      {/* See It In Action Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Phone mockup */}
            <div className="order-2 lg:order-1">
              <PhoneMockup />
            </div>
            
            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                See It In <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Action</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Your visitors get an intelligent voice assistant that knows everything about your business. They click, they ask, they get answers instantly.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Natural conversation flow",
                  "Answers from your actual content",
                  "Works on any device",
                  "Customizable look & feel"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Voice AI</span>
            </h2>
            <p className="text-gray-500">
              From URL to live voice agent in four simple steps. No coding required.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
              title="Add Your URL"
              description="Simply paste your website URL and we'll handle the rest."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="AI Learns Your Content"
              description="Our AI reads and understands every page of your website."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              }
              title="Voice Agent Ready"
              description="Get a trained voice AI that answers questions naturally."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              title="Embed Anywhere"
              description="Copy one line of code. Paste it into your site. Done."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Zukii</span> Works
            </h2>
            <p className="text-gray-500">
              From website to voice assistant in under 5 minutes
            </p>
          </div>

          <div className="space-y-2">
            <TimelineStep
              number={1}
              title="Enter Your Website URL"
              description="Paste your website's URL into the dashboard. Zukii accepts any publicly accessible website."
            />
            <TimelineStep
              number={2}
              title="Automatic Content Scraping"
              description="Our intelligent crawler visits every page, extracting and understanding your content, products, and FAQs."
            />
            <TimelineStep
              number={3}
              title="AI Training Complete"
              description="Within minutes, your custom voice AI agent is trained on your specific content and ready to answer questions."
            />
            <TimelineStep
              number={4}
              title="Copy & Embed"
              description="Grab your unique embed code and paste it into your website. The voice widget appears instantly."
              isLast
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Businesses</span>
            </h2>
            <p className="text-gray-500">
              See what our customers are saying
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Zukii transformed how we handle customer questions. Our support team now focuses on complex issues while the AI handles the basics perfectly."
              name="Sarah Chen"
              role="Head of Support, TechFlow"
              initial="S"
            />
            <TestimonialCard
              quote="Setup took literally 5 minutes. Within an hour, our website had a voice assistant that knew everything about our products."
              name="Marcus Johnson"
              role="Founder, StartupHub"
              initial="M"
            />
            <TestimonialCard
              quote="The accuracy is incredible. It answers questions I didn't even know were on our website. Our conversion rate went up 23%."
              name="Emma Williams"
              role="Marketing Director, GrowthCo"
              initial="E"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <StatCard value={1073} suffix="+" label="Websites Powered" shouldAnimate={statsVisible} />
            <StatCard value={0} suffix="M+" label="Conversations" shouldAnimate={statsVisible} />
            <StatCard value={10} suffix="%" label="Uptime" shouldAnimate={statsVisible} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Pricing</span>
            </h2>
            <p className="text-gray-500">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Free"
              price="$0"
              features={[
                "1 website",
                "1,000 conversations/mo",
                "Basic voice AI",
                "Community support",
                "Zukii branding"
              ]}
              onGetStarted={() => setLocation('/signup')}
            />
            <PricingCard
              name="Pro"
              price="$49"
              features={[
                "5 websites",
                "10,000 conversations/mo",
                "Advanced voice AI",
                "Priority support",
                "Remove branding",
                "Analytics dashboard"
              ]}
              popular
              onGetStarted={() => setLocation('/signup')}
            />
            <PricingCard
              name="Enterprise"
              price="$199"
              features={[
                "Unlimited websites",
                "Unlimited conversations",
                "Premium voice AI",
                "Dedicated support",
                "White-label solution",
                "API access"
              ]}
              onGetStarted={() => setLocation('/signup')}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-12 text-center bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-cyan-600/20 border border-violet-500/20">
            <div className="absolute inset-0 bg-[#050208]/60" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Give Your Website a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Voice</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of businesses using Zukii to engage visitors with intelligent voice AI.
              </p>
              
              <button
                onClick={() => setLocation('/signup')}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-10 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                Start Building Your Voice Agent
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <div className="mt-8">
                <p className="text-gray-500 text-sm mb-3">Your embed code will look like this:</p>
                <div className="inline-block bg-[#0a0815] px-6 py-3 rounded-lg border border-gray-800">
                  <code className="text-violet-300 text-sm font-mono">
                    {'<script src="https://zukii.ai/embed.js" data-agent-id="your-id"></script>'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div 
              className="cursor-pointer"
              onClick={() => setLocation('/')}
            >
              <img
                src="./zukii-brand-logo.png"
                alt="Zukii"
                className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button onClick={() => scrollToSection('features')} className="text-gray-500 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-500 hover:text-white transition-colors">
                Pricing
              </button>
              <button onClick={() => setLocation('/login')} className="text-gray-500 hover:text-white transition-colors">
                Login
              </button>
              <button onClick={() => setLocation('/signup')} className="text-gray-500 hover:text-white transition-colors">
                Sign Up
              </button>
            </div>

            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Zukii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes sound-bar {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
