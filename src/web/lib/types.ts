export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Frontend status types (mapped from API)
export type WebsiteStatus = 'pending' | 'scraping' | 'ready' | 'error';

// API status types
export type APIStatus = 'pending' | 'completed' | 'failed';

// Map API status to frontend status
export const mapAPIStatus = (apiStatus: APIStatus): WebsiteStatus => {
  switch (apiStatus) {
    case 'pending':
      return 'pending';
    case 'completed':
      return 'ready';
    case 'failed':
      return 'error';
    default:
      return 'pending';
  }
};

export interface Website {
  id: string;
  name: string;
  url: string;
  status: WebsiteStatus;
  createdAt: string;
  vapiAgentId?: string;
  embedCode?: string;
}

export interface Agent {
  id: string;
  websiteId: string;
  websiteName: string;
  websiteUrl: string;
  status: WebsiteStatus;
  embedCode: string;
  vapiAgentId?: string;
}
