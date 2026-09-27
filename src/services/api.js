/**
 * Bidaya Tunisia - Django REST API Client
 * Replaces Supabase with a secure, token-refreshed Django backend.
 */

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'bidaya_access_token',
  REFRESH_TOKEN: 'bidaya_refresh_token',
  USER_DATA: 'bidaya_user_data'
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
  if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

/**
 * Universal fetch wrapper with automatic JWT header and refresh token handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE}/${endpoint.replace(/^\/+/, '')}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    console.error('Network request failed:', netErr);
    throw new Error('Unable to connect to server. Please check your connection.');
  }

  // Handle Token Expiry & Automatic Refresh (401)
  if (response.status === 401 && getRefreshToken() && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: getRefreshToken() })
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setTokens({ access: refreshData.access, refresh: refreshData.refresh });
          isRefreshing = false;
          onRefreshed(refreshData.access);
        } else {
          isRefreshing = false;
          clearTokens();
          window.dispatchEvent(new CustomEvent('auth:expired'));
          throw new Error('Session expired. Please log in again.');
        }
      } catch (refreshErr) {
        isRefreshing = false;
        clearTokens();
        window.dispatchEvent(new CustomEvent('auth:expired'));
        throw refreshErr;
      }
    }

    // Wait for the new token and retry the original request
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(async (newToken) => {
        try {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          const retryRes = await fetch(url, config);
          resolve(handleResponse(retryRes));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  return handleResponse(response);
}

async function handleResponse(response) {
  if (response.status === 204) return null;

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.detail || data?.error || 'Unable to load your workspace. Please try again.';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ----------------------------------------------------------------------
// Specific API Endpoints
// ----------------------------------------------------------------------

export const api = {
  auth: {
    register: (payload) => apiFetch('auth/register/', { method: 'POST', body: payload }),
    login: (credentials) => apiFetch('auth/login/', { method: 'POST', body: credentials }),
    refresh: (refresh) => apiFetch('auth/refresh/', { method: 'POST', body: { refresh } }),
    getMe: () => apiFetch('auth/me/'),
    updateMe: (data) => apiFetch('auth/me/', { method: 'PATCH', body: data }),
    chooseRole: (role) => apiFetch('auth/choose-role/', { method: 'POST', body: { role } }),
    logout: () => apiFetch('auth/logout/', { method: 'POST', body: { refresh: getRefreshToken() } }),
    getUsers: () => apiFetch('auth/users/'),
  },

  startups: {
    getMe: () => apiFetch('startups/me/'),
    saveMe: (data) => apiFetch('startups/me/', { method: 'PUT', body: data }),
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`startups/${q ? '?' + q : ''}`);
    },
    getById: (id) => apiFetch(`startups/${id}/`),
    review: (id, payload) => apiFetch(`startups/${id}/review/`, { method: 'POST', body: payload }),
    getProgress: (startupId) => apiFetch(`startups/progress/${startupId ? `?startup_id=${startupId}` : ''}`),
    saveProgress: (data) => apiFetch('startups/progress/', { method: 'POST', body: data }),
    getMeetings: () => apiFetch('startups/meetings/'),
    createMeeting: (data) => apiFetch('startups/meetings/', { method: 'POST', body: data }),
    updateMeeting: (id, data) => apiFetch(`startups/meetings/${id}/`, { method: 'PATCH', body: data }),
    getInterests: () => apiFetch('startups/interests/'),
    createInterest: (startupId, investorId, status = 'interested') => 
      apiFetch('startups/interests/', { method: 'POST', body: { startup_id: startupId, investor_id: investorId, status } }),
  },

  investors: {
    getProfile: () => apiFetch('investor/profile/'),
    saveProfile: (data) => apiFetch('investor/profile/', { method: 'PUT', body: data }),
    list: () => apiFetch('investor/'),
    getById: (id) => apiFetch(`investor/${id}/`),
    verify: (id, payload) => apiFetch(`investor/${id}/verify/`, { method: 'POST', body: payload }),
    getDocuments: () => apiFetch('investor/documents/'),
    uploadDocument: (data) => apiFetch('investor/documents/', { method: 'POST', body: data }),
  },

  chat: {
    sendMessage: (message, role = 'startup') => 
      apiFetch('chat/', { method: 'POST', body: { message, role } }),
    guide: (question, role = 'startup') => 
      apiFetch('ai/guide/', { method: 'POST', body: { question, role } }),
  },

  admin: {
    getDashboard: () => apiFetch('admin/dashboard/'),
  },

  health: () => apiFetch('health/'),
};

export default api;
