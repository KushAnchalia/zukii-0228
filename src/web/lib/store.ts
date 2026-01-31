import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Website, Agent } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}

interface WebsiteState {
  websites: Website[];
  addWebsite: (name: string, url: string) => void;
  updateWebsiteStatus: (id: string, status: Website['status']) => void;
  getAgent: (websiteId: string) => Agent | null;
}

// Mock auth store
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
      loginWithGoogle: async () => {
        try {
          // Simulate Google OAuth API call with loading state
          await new Promise(resolve => setTimeout(resolve, 1200));
          
          // Generate unique ID for this session
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          
          const user: User = {
            id: `google-${timestamp}-${randomSuffix}`,
            name: 'Google User',
            email: 'googleuser@gmail.com',
            avatar: `https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff&bold=true`,
          };
          
          // Update state with new user
          set({ user, isAuthenticated: true });
          
          // Return success
          return true;
        } catch (error) {
          console.error('Google login failed:', error);
          return false;
        }
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

// Mock website store
export const useWebsites = create<WebsiteState>()(
  persist(
    (set, get) => ({
      websites: [],
      addWebsite: (name: string, url: string) => {
        const newWebsite: Website = {
          id: Date.now().toString(),
          name,
          url,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ websites: [...state.websites, newWebsite] }));
        
        // Simulate status changes
        setTimeout(() => {
          set(state => ({
            websites: state.websites.map(w =>
              w.id === newWebsite.id ? { ...w, status: 'scraping' as const } : w
            )
          }));
        }, 2000);
        
        setTimeout(() => {
          set(state => ({
            websites: state.websites.map(w =>
              w.id === newWebsite.id ? { ...w, status: 'ready' as const } : w
            )
          }));
        }, 5000);
      },
      updateWebsiteStatus: (id: string, status: Website['status']) => {
        set(state => ({
          websites: state.websites.map(w =>
            w.id === id ? { ...w, status } : w
          )
        }));
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
          embedCode: `<script src="https://zukii.ai/embed.js" data-agent-id="agent-${websiteId}"></script>`,
        };
      },
    }),
    {
      name: 'zukii-websites',
    }
  )
);
