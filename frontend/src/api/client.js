const TOKEN_KEY = "postmimic_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiCall(endpoint, method = "GET", body = null) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, options);
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Server returned status ${res.status}`);
  }

  if (!res.ok) {
    throw new Error(data.detail || data.message || "An unexpected error occurred");
  }

  return data;
}

// Auth API
export const authApi = {
  login: (email, password) => apiCall("/api/auth/login", "POST", { email, password }),
  register: (payload) => apiCall("/api/auth/register", "POST", payload),
  demoLogin: () => apiCall("/api/auth/demo-login", "POST"),
  getMe: () => apiCall("/api/auth/me"),
};

// Profile API
export const profileApi = {
  get: () => apiCall("/api/profile"),
  update: (data) => apiCall("/api/profile", "PUT", data),
};

// LinkedIn API
export const linkedinApi = {
  connect: (payload) => apiCall("/api/linkedin/connect", "POST", payload),
  getPresets: () => apiCall("/api/linkedin/presets"),
};

// Historic Posts API
export const postsApi = {
  getHistoric: () => apiCall("/api/posts/historic"),
  addHistoric: (payload) => apiCall("/api/posts/historic", "POST", payload),
  deleteHistoric: (id) => apiCall(`/api/posts/historic/${id}`, "DELETE"),
};

// Style DNA API
export const styleApi = {
  getStyle: () => apiCall("/api/style"),
  reanalyze: () => apiCall("/api/style/reanalyze", "POST"),
};

// Multi-Agent Generation API
export const generateApi = {
  generate: (payload) => apiCall("/api/generate", "POST", payload),
  refine: (postId, feedback) => apiCall(`/api/generate/${postId}/refine`, "POST", { feedback }),
  getDrafts: () => apiCall("/api/drafts"),
  deleteDraft: (postId) => apiCall(`/api/drafts/${postId}`, "DELETE"),
};
