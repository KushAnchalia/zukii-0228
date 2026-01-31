import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth, useWebsites } from '@/lib/store';
import type { WebsiteStatus } from '@/lib/types';
import { fetchWebsite } from '@/lib/api';
import { mapAPIStatus } from '@/lib/types';
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

// Demo iframe component - renders VAPI widget in an isolated context
const DemoPreview = ({ agentId }: { agentId: string }) => {
  const [showDemo, setShowDemo] = useState(false);
  const [copiedTestHtml, setCopiedTestHtml] = useState(false);

  // Generate test HTML that users can save and open
  const generateTestHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zukii Voice Agent Test</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f0d1a 0%, #1a1625 100%);
            color: white;
            min-height: 100vh;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            color: #9ca3af;
            max-width: 400px;
            text-align: center;
            line-height: 1.6;
        }
        .hint {
            margin-top: 2rem;
            padding: 1rem 1.5rem;
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <h1>🎤 Zukii Voice Agent</h1>
    <p>Click the voice button in the bottom-right corner to start talking to your AI assistant.</p>
    <div class="hint">
        💡 Tip: Allow microphone access when prompted to enable voice interaction.
    </div>
    
    <!-- Zukii Voice Agent Widget -->
    <script>
        var vapiInstance = null;
        const assistant = "${agentId}";
        const apiKey = "4dc6866b-07dd-4b5b-9e59-8dfbccaab172";
        const buttonConfig = {
            position: "bottom-right",
            offset: "40px",
            width: "50px",
            height: "50px",
            idle: {
                color: "rgb(93, 254, 202)",
                type: "pill",
                title: "Talk to AI",
                subtitle: "Click to start",
                icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone.svg",
            },
            loading: {
                color: "rgb(93, 124, 202)",
                type: "pill",
                title: "Connecting...",
                subtitle: "Please wait",
                icon: "https://unpkg.com/lucide-static@0.321.0/icons/loader-2.svg",
            },
            active: {
                color: "rgb(255, 0, 0)",
                type: "pill",
                title: "Call in progress",
                subtitle: "Click to end",
                icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg",
            },
        };

        (function (d, t) {
            var g = document.createElement(t),
                s = d.getElementsByTagName(t)[0];
            g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g, s);

            g.onload = function () {
                vapiInstance = window.vapiSDK.run({
                    apiKey: apiKey,
                    assistant: assistant,
                    config: buttonConfig,
                });
            };
        })(document, "script");
    </script>
</body>
</html>`;
  };

  const handleCopyTestHtml = async () => {
    try {
      await navigator.clipboard.writeText(generateTestHtml());
      setCopiedTestHtml(true);
      toast.success('Test HTML copied!', {
        description: 'Save as .html file and open in your browser',
        icon: '📋',
      });
      setTimeout(() => setCopiedTestHtml(false), 3000);
    } catch {
      toast.error('Failed to copy. Please try again.');
    }
  };

  const handleOpenTestPage = () => {
    const html = generateTestHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=500,height=700,menubar=no,toolbar=no');
    toast.success('Test page opened!', {
      description: 'Allow microphone access to start talking',
      icon: '🎤',
    });
  };

  // Create iframe with srcdoc for isolated demo
  const iframeSrcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #0a0612 0%, #150d20 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
            color: white;
            padding: 20px;
        }
        .content {
            text-align: center;
            max-width: 300px;
        }
        h2 {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
            background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            color: #9ca3af;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        .pulse-ring {
            position: absolute;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid rgba(139, 92, 246, 0.4);
            animation: pulse 2s ease-out infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="content">
        <h2>🎤 Voice Agent Active</h2>
        <p>Click the button in the corner to start a voice conversation with your AI assistant.</p>
    </div>
    <div class="pulse-ring"></div>
    
    <script>
        var vapiInstance = null;
        const assistant = "${agentId}";
        const apiKey = "4dc6866b-07dd-4b5b-9e59-8dfbccaab172";
        const buttonConfig = {
            position: "bottom-right",
            offset: "20px",
            width: "50px",
            height: "50px",
            idle: {
                color: "rgb(139, 92, 246)",
                type: "pill",
                title: "Talk to AI",
                subtitle: "Click to start",
                icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone.svg",
            },
            loading: {
                color: "rgb(93, 124, 202)",
                type: "pill",
                title: "Connecting...",
                subtitle: "Please wait",
                icon: "https://unpkg.com/lucide-static@0.321.0/icons/loader-2.svg",
            },
            active: {
                color: "rgb(239, 68, 68)",
                type: "pill",
                title: "Call active",
                subtitle: "Click to end",
                icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg",
            },
        };

        (function (d, t) {
            var g = document.createElement(t),
                s = d.getElementsByTagName(t)[0];
            g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g, s);

            g.onload = function () {
                vapiInstance = window.vapiSDK.run({
                    apiKey: apiKey,
                    assistant: assistant,
                    config: buttonConfig,
                });
            };
        })(document, "script");
    </script>
</body>
</html>`;

  return (
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
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Test your voice agent right here! Choose one of the options below to try it out.
        </p>

        {/* Demo options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option 1: Open in new window */}
          <button
            onClick={handleOpenTestPage}
            className="group relative p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Open Test Page</h3>
                <p className="text-gray-400 text-xs">Opens a new window with the voice widget ready to use</p>
              </div>
            </div>
          </button>

          {/* Option 2: Copy test HTML */}
          <button
            onClick={handleCopyTestHtml}
            className={`group relative p-4 rounded-2xl border transition-all duration-300 text-left ${
              copiedTestHtml 
                ? 'bg-emerald-500/10 border-emerald-500/40' 
                : 'bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20 hover:border-violet-500/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                copiedTestHtml 
                  ? 'bg-emerald-500/30' 
                  : 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30'
              }`}>
                {copiedTestHtml ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${copiedTestHtml ? 'text-emerald-400' : 'text-white'}`}>
                  {copiedTestHtml ? 'Copied!' : 'Copy Test HTML'}
                </h3>
                <p className="text-gray-400 text-xs">Copy a standalone HTML file to test locally</p>
              </div>
            </div>
          </button>
        </div>

        {/* Toggle embedded demo */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm">Or try it embedded below:</span>
          <button
            onClick={() => setShowDemo(!showDemo)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              showDemo 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'btn-gradient text-white'
            }`}
          >
            {showDemo ? 'Hide Demo' : 'Show Demo'}
          </button>
        </div>

        {/* Embedded iframe demo */}
        {showDemo && (
          <div className="relative rounded-2xl overflow-hidden border border-violet-500/30 animate-scale-in">
            <iframe
              srcDoc={iframeSrcDoc}
              title="Voice Agent Demo"
              className="w-full h-[400px] bg-[#0a0612]"
              allow="microphone"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
            
            {/* Overlay hint */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-medium backdrop-blur-sm">
              💡 Click the button in the corner to start
            </div>
          </div>
        )}

        {/* Microphone permission note */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-400/80 text-xs">
              <strong>Note:</strong> Your browser will ask for microphone permission. Allow it to enable voice interaction with your AI agent.
            </p>
          </div>
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
    } catch {
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
          <DemoPreview agentId={agent.vapiAgentId} />
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
    </div>
  );
};

export default AgentDetails;
