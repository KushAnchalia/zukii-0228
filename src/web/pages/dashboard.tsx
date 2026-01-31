import { useState } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth, useWebsites } from '@/lib/store';
import type { WebsiteStatus } from '@/lib/types';
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
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${bgClass}`}>
      {status === 'scraping' ? (
        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
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

const Dashboard = () => {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { websites, addWebsite, updateWebsiteStatus } = useWebsites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    addWebsite(websiteName, websiteUrl);
    
    setWebsiteName('');
    setWebsiteUrl('');
    setIsModalOpen(false);
    setIsAdding(false);
  };

  const handleRescrape = (id: string) => {
    updateWebsiteStatus(id, 'scraping');
    setTimeout(() => updateWebsiteStatus(id, 'ready'), 3000);
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-[#050208] relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt="Chugli.ai"
                className="h-10 w-auto logo-glow"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <span>{user?.email}</span>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 p-[2px] cursor-pointer">
                  <div className="w-full h-full rounded-full bg-[#0a0612] flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 font-display">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-status-pulse" />
              Manage your voice AI agents
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 whitespace-nowrap group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Website
          </button>
        </div>

        {/* Websites Grid */}
        {websites.length === 0 ? (
          <div className="animate-fade-in-up stagger-1 opacity-0">
            <div className="glass-card gradient-border rounded-3xl p-12 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-violet-500/10 to-transparent blur-3xl" />
              
              <div className="empty-state-icon w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center relative">
                <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 font-display">No websites yet</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Add your first website to create a voice AI agent that can answer questions about your content.
              </p>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gradient px-8 py-4 rounded-xl text-white font-semibold inline-flex items-center gap-3 text-lg group"
              >
                <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Website
              </button>

              {/* Decorative dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500/30" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website, index) => (
              <div
                key={website.id}
                className={`website-card p-6 animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 6)}`}
              >
                {/* Card top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate mb-1 font-display">
                      {website.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {website.url}
                    </p>
                  </div>
                  <StatusBadge status={website.status} />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setLocation(`/agents/${website.id}`)}
                    disabled={website.status !== 'ready'}
                    className="flex-1 py-2.5 px-4 btn-secondary text-white text-sm font-medium rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Agent
                  </button>
                  <button
                    onClick={() => handleRescrape(website.id)}
                    disabled={website.status === 'scraping'}
                    className="py-2.5 px-4 btn-icon rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Re-scrape website"
                  >
                    <svg className={`w-4 h-4 text-white ${website.status === 'scraping' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Website Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[rgba(20,15,35,0.95)] backdrop-blur-xl border-[rgba(139,92,246,0.2)] text-white sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display">
              Add New <span className="gradient-text">Website</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddWebsite} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label htmlFor="modal-name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Website Name
              </label>
              <Input
                id="modal-name"
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="My Company"
                required
                className="bg-[rgba(45,35,70,0.3)] border-[rgba(139,92,246,0.2)] text-white placeholder:text-gray-500 h-12 rounded-xl input-focus"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="modal-url" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Website URL
              </label>
              <Input
                id="modal-url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="bg-[rgba(45,35,70,0.3)] border-[rgba(139,92,246,0.2)] text-white placeholder:text-gray-500 h-12 rounded-xl input-focus"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-4 btn-secondary text-white font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="flex-1 py-3 px-4 btn-gradient text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Website
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
