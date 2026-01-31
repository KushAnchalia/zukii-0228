// API client for Zukii backend
const API_BASE = 'https://zukii-backend.onrender.com/api';

export interface APIWebsite {
  id: string;
  url: string;
  name?: string;
  status: 'pending' | 'completed' | 'failed';
  vapi_agent_id?: string;
  embed_code?: string;
  created_at: string;
}

interface APIError {
  message: string;
  status: number;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error: APIError = {
      message: `Request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }
  return response.json();
};

// Get all websites
export const fetchWebsites = async (): Promise<APIWebsite[]> => {
  const response = await fetch(`${API_BASE}/websites`);
  return handleResponse<APIWebsite[]>(response);
};

// Add a new website
export const createWebsite = async (url: string, name: string): Promise<APIWebsite> => {
  const response = await fetch(`${API_BASE}/websites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, name }),
  });
  return handleResponse<APIWebsite>(response);
};

// Get a single website by ID
export const fetchWebsite = async (id: string): Promise<APIWebsite> => {
  const response = await fetch(`${API_BASE}/websites/${id}`);
  return handleResponse<APIWebsite>(response);
};

// Delete a website
export const deleteWebsite = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/websites/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete website with status ${response.status}`);
  }
};
