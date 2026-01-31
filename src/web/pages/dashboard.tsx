import { useState } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth, useWebsites } from '@/lib/store';
import type { WebsiteStatus } from '@/lib/types';

const StatusBadge = ({ status }: { status: WebsiteStatus }) => {
  const config = {
    pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    scraping: { label: 'Scraping', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    ready: { label: 'Ready', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    error: { label: 'Error', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={`${className} font-medium`}>
      {status === 'scraping' && (
        <svg className="w-3 h-3 mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {status === 'ready' && (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </Badge>
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
    <div className="min-h-screen bg-[#0F0D1A]">
      {/* Navigation */}
      <nav className="border-b border-[#252136] bg-[#0F0D1A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="./chugli-logo-speech-wave-lrJ6m_0uOCFqaG1qx7mld.png"
                alt="Chugli.ai"
                className="h-10 w-auto"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <span>{user?.email}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B21A8] to-[#7C3AED] flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-gray-400">Manage your voice AI agents</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Website
          </button>
        </div>

        {/* Websites Grid */}
        {websites.length === 0 ? (
          <div className="animate-fade-in-up stagger-1 opacity-0">
            <div className="bg-[#1A1625] border border-[#252136] rounded-2xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#252136] flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No websites yet</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Add your first website to create a voice AI agent that can answer questions about your content.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Website
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website, index) => (
              <div
                key={website.id}
                className={`bg-[#1A1625] border border-[#252136] rounded-2xl p-6 card-hover animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 5)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate mb-1">
                      {website.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{website.url}</p>
                  </div>
                  <StatusBadge status={website.status} />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setLocation(`/agents/${website.id}`)}
                    disabled={website.status !== 'ready'}
                    className="flex-1 py-2.5 px-4 bg-[#252136] hover:bg-[#363050] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    View Agent
                  </button>
                  <button
                    onClick={() => handleRescrape(website.id)}
                    disabled={website.status === 'scraping'}
                    className="py-2.5 px-4 bg-[#252136] hover:bg-[#363050] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    title="Re-scrape website"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <DialogContent className="bg-[#1A1625] border-[#252136] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Website</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddWebsite} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label htmlFor="modal-name" className="text-sm font-medium text-gray-300">
                Website Name
              </label>
              <Input
                id="modal-name"
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="My Company"
                required
                className="bg-[#252136] border-[#363050] text-white placeholder:text-gray-500 h-12 input-focus"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="modal-url" className="text-sm font-medium text-gray-300">
                Website URL
              </label>
              <Input
                id="modal-url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="bg-[#252136] border-[#363050] text-white placeholder:text-gray-500 h-12 input-focus"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-4 bg-[#252136] hover:bg-[#363050] text-white font-medium rounded-xl transition-colors"
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
                  'Add Website'
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
