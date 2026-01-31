import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth, useWebsites } from '@/lib/store';
import type { WebsiteStatus } from '@/lib/types';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/animated-background';

const StatusBadge = ({ status }: { status: WebsiteStatus }) => {
  const config = {
    pending: { 
      label: 'Pending', 
      dotClass: 'status-dot-pending',
      bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
    },
    scraping: { 
      label: 'Scraping', 
      dotClass: 'status-dot-scraping',
      bgClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
    },
    ready: { 
      label: 'Ready', 
      dotClass: 'status-dot-ready',
      bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
    },
    error: { 
      label: 'Error', 
      dotClass: 'status-dot-error',
      bgClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
    },
  };

  const { label, dotClass, bgClass } = config[status];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${bgClass}`}>
      {status === 'scraping' ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <span className={`status-dot ${dotClass}`} />
      )}
      {label}
    </div>
  );
};

const AgentDetails = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { getAgent } = useWebsites();
  const [copied, setCopied] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  const agent = getAgent(params.id || '');

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#050208] flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center relative z-10 glass-card gradient-border rounded-3xl p-12 max-w-md mx-4 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-display">Agent not found</h1>
          <p className="text-gray-400 mb-8">The agent you're looking for doesn't exist.</p>
          <button
            onClick={() => setLocation('/dashboard')}
            className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleCopyCode = async () => {
    try {
      // Use the Clipboard API
      await navigator.clipboard.writeText(agent.embedCode);
      setCopied(true);
      toast.success('Embed code copied to clipboard!', {
        description: 'Paste it into your website\'s HTML',
        icon: '✨',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers or restricted contexts
      const textArea = document.createElement('textarea');
      textArea.value = agent.embedCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Embed code copied to clipboard!', {
          description: 'Paste it into your website\'s HTML',
          icon: '✨',
        });
        setTimeout(() => setCopied(false), 3000);
      } catch {
        toast.error('Failed to copy code. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-[#050208] relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt=""
                className="h-9 w-auto logo-glow"
              />
              <span className="text-xl font-bold text-white font-display gradient-text">Zukii</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => setLocation('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 animate-fade-in group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Agent Header */}
        <div className="glass-card gradient-border rounded-3xl p-8 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-3 font-display">{agent.websiteName}</h1>
              <a
                href={agent.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors inline-flex items-center gap-2 group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {agent.websiteUrl}
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <StatusBadge status={agent.status} />
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="glass-card gradient-border rounded-3xl p-8 animate-fade-in-up stagger-1 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Embed Code
            </h2>
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow'
                  : 'btn-secondary text-white hover:scale-105'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Add this code snippet to your website to embed the voice AI agent. Place it just before the closing <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded font-mono text-xs">&lt;/body&gt;</code> tag.
          </p>

          <div className="relative">
            <div className="code-block p-6 overflow-x-auto">
              {/* Decorative terminal header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-violet-500/10">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <span className="ml-2 text-xs text-gray-500 font-mono">embed-code.html</span>
              </div>
              <code className="text-sm font-mono text-violet-300 leading-relaxed block">
                {agent.embedCode}
              </code>
            </div>
            
            {/* Click to copy overlay hint */}
            <div 
              onClick={handleCopyCode}
              className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center bg-violet-500/5 rounded-xl"
            >
              <div className="bg-violet-500/20 backdrop-blur-sm px-4 py-2 rounded-lg text-violet-300 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Click to copy
              </div>
            </div>
          </div>

          {agent.status !== 'ready' && (
            <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 animate-scale-in">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-amber-400 font-semibold text-sm">Agent not ready</p>
                  <p className="text-amber-400/70 text-sm mt-1">
                    Your agent is still being prepared. The embed code will work once the status changes to "Ready".
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="glass-card gradient-border rounded-3xl p-8 mt-6 animate-fade-in-up stagger-2 opacity-0">
          <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Integration Instructions
          </h2>
          <ol className="space-y-5">
            {[
              { step: 1, text: 'Copy the embed code above by clicking the "Copy Code" button.' },
              { step: 2, text: 'Open your website\'s HTML file or template where you want to add the voice agent.' },
              { step: 3, text: <>Paste the code just before the closing <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded font-mono text-xs">&lt;/body&gt;</code> tag.</> },
              { step: 4, text: 'Save and publish your changes. The voice AI widget will appear on your website.' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-4 group">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {step}
                </span>
                <span className="text-gray-300 text-sm pt-1">{text}</span>
              </li>
            ))}
          </ol>
          
          {/* Help section */}
          <div className="mt-8 pt-6 border-t border-violet-500/10">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Need help? Check our{' '}
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">documentation</span>
              {' '}or{' '}
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">contact support</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDetails;
