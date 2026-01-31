export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type WebsiteStatus = 'pending' | 'scraping' | 'ready' | 'error';

export interface Website {
  id: string;
  name: string;
  url: string;
  status: WebsiteStatus;
  createdAt: string;
}

export interface Agent {
  id: string;
  websiteId: string;
  websiteName: string;
  websiteUrl: string;
  status: WebsiteStatus;
  embedCode: string;
}
