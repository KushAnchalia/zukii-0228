import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Website, Agent } from './types';
import { mapAPIStatus } from './types';
import { fetchWebsites, createWebsite, fetchWebsite, deleteWebsite, type APIWebsite } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface WebsiteState {
  websites: Website[];
  isLoading: boolean;
  error: string | null;
  fetchAllWebsites: () => Promise<void>;
  addWebsite: (name: string, url: string) => Promise<Website | null>;
  refreshWebsite: (id: string) => Promise<void>;
  removeWebsite: (id: string) => Promise<void>;
  getAgent: (websiteId: string) => Agent | null;
  clearError: () => void;
}

// Convert API response to frontend Website type
const mapAPIWebsiteToWebsite = (apiWebsite: APIWebsite): Website => ({
  id: apiWebsite.id,
  name: apiWebsite.name || new URL(apiWebsite.url).hostname,
  url: apiWebsite.url,
  status: mapAPIStatus(apiWebsite.status),
  createdAt: apiWebsite.created_at,
  vapiAgentId: apiWebsite.vapi_agent_id,
  embedCode: apiWebsite.embed_code,
});

// Auth store
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const user: User = {
          id: '1',
          name: email.split('@')[0],
          email,
        };
        set({ user, isAuthenticated: true });
        return true;
      },
      signup: async (name: string, email: string, _password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const user: User = {
          id: '1',
          name,
          email,
        };
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'zukii-auth',
    }
  )
);

// Website store with real API integration
export const useWebsites = create<WebsiteState>()((set, get) => ({
  websites: [],
  isLoading: false,
  error: null,
  
  fetchAllWebsites: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiWebsites = await fetchWebsites();
      const websites = apiWebsites.map(mapAPIWebsiteToWebsite);
      set({ websites, isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch websites', 
        isLoading: false 
      });
    }
  },
  
  addWebsite: async (name: string, url: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiWebsite = await createWebsite(url, name);
      const website = mapAPIWebsiteToWebsite(apiWebsite);
      set(state => ({ 
        websites: [...state.websites, website], 
        isLoading: false 
      }));
      return website;
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to add website', 
        isLoading: false 
      });
      return null;
    }
  },
  
  refreshWebsite: async (id: string) => {
    try {
      const apiWebsite = await fetchWebsite(id);
      const website = mapAPIWebsiteToWebsite(apiWebsite);
      set(state => ({
        websites: state.websites.map(w => w.id === id ? website : w)
      }));
    } catch (err) {
      console.error('Failed to refresh website:', err);
    }
  },
  
  removeWebsite: async (id: string) => {
    try {
      await deleteWebsite(id);
      set(state => ({
        websites: state.websites.filter(w => w.id !== id)
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to delete website'
      });
    }
  },
  
  getAgent: (websiteId: string) => {
    const website = get().websites.find(w => w.id === websiteId);
    if (!website) return null;
    
    return {
      id: `agent-${websiteId}`,
      websiteId,
      websiteName: website.name,
      websiteUrl: website.url,
      status: website.status,
      embedCode: website.embedCode || `<script src="https://zukii.ai/embed.js" data-agent-id="${website.vapiAgentId || websiteId}"></script>`,
      vapiAgentId: website.vapiAgentId,
    };
  },
  
  clearError: () => set({ error: null }),
}));
