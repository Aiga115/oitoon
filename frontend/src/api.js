import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: API_URL });

// Tokens are kept in localStorage, one entry for users and one for admins.
export function getTokens(kind) {
  try {
    return JSON.parse(localStorage.getItem(kind + "_tokens"));
  } catch {
    return null;
  }
}
export function saveTokens(kind, tokens) {
  localStorage.setItem(kind + "_tokens", JSON.stringify(tokens));
}
export function clearTokens(kind) {
  localStorage.removeItem(kind + "_tokens");
}

// Requests to /admin/... use the admin token, everything else uses the user token.
function kindOf(url) {
  return url.startsWith("/admin/") ? "admin" : "user";
}

// Turns a DRF error response into one readable sentence.
export function errorText(err) {
  const data = err.response?.data;
  if (!data) return "Cannot reach the server.";
  if (data.detail) return data.detail;
  return Object.values(data).flat().join(" ");
}

// Before every request: add "Authorization: Bearer <access token>".
// Login and register requests never get the header.
api.interceptors.request.use((config) => {
  if (config.url.includes("/auth/")) return config;
  const tokens = getTokens(kindOf(config.url));
  if (tokens) config.headers.Authorization = "Bearer " + tokens.access;
  return config;
});

// After a 401 (access token expired): get a new access token with the refresh token
// and repeat the request once. If that fails, log out and go to the login page.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const kind = kindOf(original.url);
    const tokens = getTokens(kind);
    const canRetry =
      error.response?.status === 401 && tokens && !original._retried && !original.url.includes("/auth/");
    if (canRetry) {
      original._retried = true;
      try {
        const res = await axios.post(API_URL + "/auth/token/refresh/", { refresh: tokens.refresh });
        saveTokens(kind, { ...tokens, access: res.data.access });
        return api(original);
      } catch {
        clearTokens(kind);
        window.location.href = kind === "admin" ? "/admin/login" : "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;