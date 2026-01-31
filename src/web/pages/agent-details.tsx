import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth, useWebsites } from '@/lib/store';
import type { WebsiteStatus } from '@/lib/types';
import { fetchWebsite } from '@/lib/api';
import { mapAPIStatus } from '@/lib/types';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/animated-background';
import Vapi from '@vapi-ai/web';

// VAPI Public Key - Replace with actual key from env or config
const VAPI_PUBLIC_KEY = '4dc6866b-07dd-4b5b-9e59-8dfbccaab172';

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
      {status === 'scraping' || status === 'pending' ? (
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

// Skeleton loader
const AgentDetailsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="glass-card gradient-border rounded-3xl p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="h-8 bg-violet-500/20 rounded w-1/2 mb-3" />
          <div className="h-4 bg-violet-500/10 rounded w-1/3" />
        </div>
        <div className="h-10 bg-violet-500/20 rounded-full w-24" />
      </div>
    </div>
    <div className="glass-card gradient-border rounded-3xl p-8">
      <div className="h-6 bg-violet-500/20 rounded w-32 mb-4" />
      <div className="h-32 bg-violet-500/10 rounded-xl" />
    </div>
  </div>
);

interface Agent {
  id: string;
  websiteId: string;
  websiteName: string;
  websiteUrl: string;
  status: WebsiteStatus;
  embedCode: string;
  vapiAgentId?: string;
}

// Voice Widget Component - Floating button that appears when demo is active
const VoiceWidget = ({ 
  isActive, 
  isSpeaking, 
  isListening,
  onToggle,
  volumeLevel 
}: { 
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  onToggle: () => void;
  volumeLevel: number;
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Ripple effects when speaking */}
      {isSpeaking && (
        <>
          <div 
            className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping"
            style={{ animationDuration: '1.5s' }}
          />
          <div 
            className="absolute inset-0 rounded-full bg-fuchsia-500/20 animate-ping"
            style={{ animationDuration: '2s', animationDelay: '0.5s' }}
          />
        </>
      )}
      
      {/* Main button */}
      <button
        onClick={onToggle}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isListening 
            ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/50' 
            : isSpeaking
              ? 'bg-gradient-to-br from-cyan-500 to-violet-600 shadow-cyan-500/50'
              : 'bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/50'
        }`}
        style={{
          transform: isSpeaking ? `scale(${1 + volumeLevel * 0.2})` : 'scale(1)',
        }}
      >
        {isListening ? (
          // Listening icon - animated mic
          <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        ) : (
          // Speaking or idle icon
          <svg className={`w-8 h-8 text-white ${isSpeaking ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Status text */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
          isListening 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            : isSpeaking
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
        }`}>
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Click to talk'}
        </div>
      </div>
    </div>
  );
};

const AgentDetails = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { getAgent } = useWebsites();
  const [copied, setCopied] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // VAPI state
  const [demoActive, setDemoActive] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callActive, setCallActive] = useState(false);
  
  // VAPI instance ref
  const vapiRef = useRef<Vapi | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  // Fetch agent data
  useEffect(() => {
    const loadAgent = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to get from local store
        const localAgent = getAgent(params.id);
        
        if (localAgent) {
          setAgent(localAgent);
          setIsLoading(false);
        }
        
        // Then fetch fresh data from API
        const apiWebsite = await fetchWebsite(params.id);
        const freshAgent: Agent = {
          id: `agent-${apiWebsite.id}`,
          websiteId: apiWebsite.id,
          websiteName: apiWebsite.name || new URL(apiWebsite.url).hostname,
          websiteUrl: apiWebsite.url,
          status: mapAPIStatus(apiWebsite.status),
          embedCode: apiWebsite.embed_code || `<script src="https://zukii.ai/embed.js" data-agent-id="${apiWebsite.vapi_agent_id || apiWebsite.id}"></script>`,
          vapiAgentId: apiWebsite.vapi_agent_id,
        };
        setAgent(freshAgent);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch agent:', err);
        
        // Fall back to local store if API fails
        const localAgent = getAgent(params.id);
        if (localAgent) {
          setAgent(localAgent);
        } else {
          setError('Failed to load agent details');
        }
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [params.id, getAgent]);

  // Poll for pending agents
  useEffect(() => {
    if (!agent || agent.status !== 'pending') return;

    const pollInterval = setInterval(async () => {
      try {
        const apiWebsite = await fetchWebsite(params.id || '');
        const freshStatus = mapAPIStatus(apiWebsite.status);
        
        if (freshStatus !== 'pending') {
          setAgent(prev => prev ? {
            ...prev,
            status: freshStatus,
            embedCode: apiWebsite.embed_code || prev.embedCode,
            vapiAgentId: apiWebsite.vapi_agent_id,
          } : null);
          
          if (freshStatus === 'ready') {
            toast.success('Your agent is ready!', {
              description: 'You can now embed it on your website.',
              icon: '🎉',
            });
          }
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [agent, params.id]);

  // Initialize VAPI instance
  const initVapi = useCallback(() => {
    if (vapiRef.current) return vapiRef.current;
    
    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      
      // Set up event listeners
      vapi.on('call-start', () => {
        console.log('VAPI: Call started');
        setCallActive(true);
        setDemoLoading(false);
        setDemoActive(true);
        toast.success('Voice agent connected!', {
          description: 'Start speaking to interact with your AI agent.',
          icon: '🎤',
        });
      });

      vapi.on('call-end', () => {
        console.log('VAPI: Call ended');
        setCallActive(false);
        setDemoActive(false);
        setIsSpeaking(false);
        setIsListening(false);
        toast.info('Call ended', {
          description: 'Voice agent disconnected.',
          icon: '👋',
        });
      });

      vapi.on('speech-start', () => {
        console.log('VAPI: Speech started');
        setIsSpeaking(true);
        setIsListening(false);
      });

      vapi.on('speech-end', () => {
        console.log('VAPI: Speech ended');
        setIsSpeaking(false);
      });

      vapi.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
        // If volume is detected, user is likely speaking
        if (volume > 0.1) {
          setIsListening(true);
          setIsSpeaking(false);
        }
      });

      vapi.on('message', (message: unknown) => {
        console.log('VAPI message:', message);
      });

      vapi.on('error', (err: Error) => {
        console.error('VAPI error:', err);
        setDemoLoading(false);
        setDemoError(err.message || 'Failed to connect to voice agent');
        toast.error('Voice agent error', {
          description: err.message || 'Something went wrong. Please try again.',
        });
      });

      vapiRef.current = vapi;
      return vapi;
    } catch (err) {
      console.error('Failed to initialize VAPI:', err);
      return null;
    }
  }, []);

  // Cleanup VAPI on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current && callActive) {
        vapiRef.current.stop();
      }
    };
  }, [callActive]);

  const handleCopyCode = async () => {
    if (!agent) return;
    
    try {
      await navigator.clipboard.writeText(agent.embedCode);
      setCopied(true);
      toast.success('Embed code copied to clipboard!', {
        description: 'Paste it into your website\'s HTML',
        icon: '✨',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
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

  // Start VAPI call
  const handleStartDemo = async () => {
    if (!agent?.vapiAgentId) {
      toast.error('No agent ID available', {
        description: 'This agent is not configured for voice demos.',
      });
      return;
    }

    setDemoLoading(true);
    setDemoError(null);

    try {
      const vapi = initVapi();
      if (!vapi) {
        throw new Error('Failed to initialize voice SDK');
      }

      console.log('Starting VAPI call with assistant:', agent.vapiAgentId);
      await vapi.start(agent.vapiAgentId);
    } catch (err) {
      console.error('Failed to start demo:', err);
      setDemoLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setDemoError(errorMessage);
      toast.error('Failed to start voice agent', {
        description: errorMessage,
      });
    }
  };

  // Stop VAPI call
  const handleStopDemo = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setDemoActive(false);
    setCallActive(false);
    setIsSpeaking(false);
    setIsListening(false);
  };

  // Toggle call (for the floating widget)
  const handleToggleCall = () => {
    if (callActive) {
      handleStopDemo();
    } else {
      handleStartDemo();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050208] relative overflow-hidden">
        <AnimatedBackground />
        <nav className="nav-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              <div className="flex items-center cursor-pointer" onClick={() => setLocation('/')}>
                <img
                  src="./zukii-brand-logo.png"
                  alt="Zukii"
                  className="h-20 md:h-[85px] w-auto"
                  style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))' }}
                />
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="h-6 bg-violet-500/10 rounded w-40 mb-8 animate-pulse" />
          <AgentDetailsSkeleton />
        </main>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-[#050208] flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center relative z-10 glass-card gradient-border rounded-3xl p-12 max-w-md mx-4 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-display">
            {error || 'Agent not found'}
          </h1>
          <p className="text-gray-400 mb-8">The agent you're looking for doesn't exist or couldn't be loaded.</p>
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

  return (
    <div className="min-h-screen bg-[#050208] relative overflow-hidden">
      <AnimatedBackground />

      {/* Voice Widget - Floating button */}
      <VoiceWidget 
        isActive={demoActive}
        isSpeaking={isSpeaking}
        isListening={isListening}
        onToggle={handleToggleCall}
        volumeLevel={volumeLevel}
      />

      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center cursor-pointer" onClick={() => setLocation('/')}>
              <img
                src="./zukii-brand-logo.png"
                alt="Zukii"
                className="h-20 md:h-[85px] w-auto"
                style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))' }}
              />
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
        <div className="glass-card gradient-border rounded-3xl p-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">{agent.websiteName}</h1>
              <a 
                href={agent.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-violet-400 transition-colors text-sm inline-flex items-center gap-1 group"
              >
                {agent.websiteUrl}
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <StatusBadge status={agent.status} />
          </div>

          {/* Agent ID Info */}
          {agent.vapiAgentId && (
            <div className="mt-4 pt-4 border-t border-violet-500/20">
              <p className="text-xs text-gray-500">
                Agent ID: <code className="text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded">{agent.vapiAgentId}</code>
              </p>
            </div>
          )}
        </div>

        {/* Embed Code Section */}
        <div className="glass-card gradient-border rounded-3xl p-8 mt-6 animate-fade-in-up stagger-1 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Embed Code
            </h2>
            <button
              onClick={handleCopyCode}
              disabled={agent.status !== 'ready'}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
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
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-violet-500/10">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <span className="ml-2 text-xs text-gray-500 font-mono">embed-code.html</span>
              </div>
              <code className="text-sm font-mono text-violet-300 leading-relaxed block whitespace-pre-wrap break-all">
                {agent.embedCode}
              </code>
            </div>
            
            {agent.status === 'ready' && (
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
            )}
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
                    {agent.status === 'pending' 
                      ? 'Your agent is being prepared. This usually takes a few minutes. We\'ll update the status automatically.'
                      : 'There was an error processing your website. Please try again or contact support.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Demo Section - Only show when agent is ready */}
        {agent.status === 'ready' && agent.vapiAgentId && (
          <div className="glass-card gradient-border rounded-3xl p-8 mt-6 animate-fade-in-up stagger-1 opacity-0 relative overflow-hidden">
            {/* Animated glow border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 opacity-50 animate-pulse" style={{ animationDuration: '3s' }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Live Demo
                </h2>
                
                {demoActive && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Connected'}
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-6">
                Try your voice agent right here! Click the button below to start a conversation with your AI assistant.
              </p>

              {/* Voice Wave Animation */}
              <div className="flex justify-center mb-6">
                <div className="flex items-end gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-to-t from-cyan-500 to-violet-500 rounded-full transition-all duration-300 ${
                        demoActive ? 'animate-sound-wave' : 'h-2 opacity-30'
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: demoActive ? undefined : '8px',
                        transform: isSpeaking ? `scaleY(${1 + volumeLevel * 3})` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {demoError && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-rose-400 font-medium text-sm">Failed to start voice agent</p>
                      <p className="text-rose-400/70 text-xs mt-1">{demoError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                {!demoActive ? (
                  <button
                    onClick={handleStartDemo}
                    disabled={demoLoading}
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {/* Button gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:scale-105" />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    
                    <div className="relative flex items-center gap-3">
                      {demoLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          Try Voice Agent
                        </>
                      )}
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleStopDemo}
                    className="group px-6 py-3 rounded-xl font-semibold text-rose-400 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      End Call
                    </div>
                  </button>
                )}
              </div>

              {/* Instructions when active */}
              {demoActive && (
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {isListening 
                      ? '🎤 Speak now - your agent is listening...'
                      : isSpeaking 
                        ? '🔊 Your agent is responding...'
                        : '💬 Say something to start the conversation'}
                  </p>
                </div>
              )}

              {/* Floating widget hint */}
              {demoActive && (
                <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
                  <span>You can also use the floating widget</span>
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

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
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center animate-fade-in-up stagger-3 opacity-0">
          <p className="text-gray-500 text-sm">
            Need help? Check out our{' '}
            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
              documentation
            </a>{' '}
            or{' '}
            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
              contact support
            </a>
            .
          </p>
        </div>
      </main>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes sound-wave {
          0%, 100% { height: 8px; }
          50% { height: 32px; }
        }
        .animate-sound-wave {
          animation: sound-wave 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AgentDetails;
