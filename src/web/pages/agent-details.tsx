import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { useAuth, useWebsites } from '@/lib/store';
import type { WebsiteStatus } from '@/lib/types';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: WebsiteStatus }) => {
  const config = {
    pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    scraping: { label: 'Scraping', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    ready: { label: 'Ready', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    error: { label: 'Error', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={`${className} font-medium text-sm px-3 py-1`}>
      {status === 'scraping' && (
        <svg className="w-3 h-3 mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {status === 'ready' && (
        <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
      )}
      {label}
    </Badge>
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
      <div className="min-h-screen bg-[#0F0D1A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Agent not found</h1>
          <p className="text-gray-400 mb-6">The agent you're looking for doesn't exist.</p>
          <button
            onClick={() => setLocation('/dashboard')}
            className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(agent.embedCode);
      setCopied(true);
      toast.success('Embed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0D1A]">
      {/* Navigation */}
      <nav className="border-b border-[#252136] bg-[#0F0D1A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt="Chugli.ai"
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setLocation('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 animate-fade-in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Agent Header */}
        <div className="bg-[#1A1625] border border-[#252136] rounded-2xl p-8 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{agent.websiteName}</h1>
              <a
                href={agent.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A78BFA] hover:text-[#C4B5FD] text-sm transition-colors flex items-center gap-1"
              >
                {agent.websiteUrl}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <StatusBadge status={agent.status} />
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="bg-[#1A1625] border border-[#252136] rounded-2xl p-8 animate-fade-in-up stagger-1 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Embed Code</h2>
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#252136] hover:bg-[#363050] text-white'
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
            Add this code snippet to your website to embed the voice AI agent. Place it just before the closing <code className="text-[#A78BFA]">&lt;/body&gt;</code> tag.
          </p>

          <div className="relative">
            <pre className="bg-[#0F0D1A] border border-[#252136] rounded-xl p-6 overflow-x-auto">
              <code className="text-sm font-mono text-[#A78BFA]">
                {agent.embedCode}
              </code>
            </pre>
          </div>

          {agent.status !== 'ready' && (
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-yellow-400 font-medium text-sm">Agent not ready</p>
                  <p className="text-yellow-400/80 text-sm mt-1">
                    Your agent is still being prepared. The embed code will work once the status changes to "Ready".
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-[#1A1625] border border-[#252136] rounded-2xl p-8 mt-6 animate-fade-in-up stagger-2 opacity-0">
          <h2 className="text-lg font-semibold text-white mb-4">Integration Instructions</h2>
          <ol className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6B21A8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <span>Copy the embed code above by clicking the "Copy Code" button.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6B21A8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span>Open your website's HTML file or template where you want to add the voice agent.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6B21A8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
              <span>Paste the code just before the closing <code className="text-[#A78BFA]">&lt;/body&gt;</code> tag.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6B21A8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
              <span>Save and publish your changes. The voice AI widget will appear on your website.</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default AgentDetails;
