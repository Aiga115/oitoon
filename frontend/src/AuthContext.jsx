import { createContext, useContext, useState } from "react";
import api, { getTokens, saveTokens, clearTokens } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Start from localStorage so a page refresh keeps you logged in.
  const [user, setUser] = useState(getTokens("user")?.username || null);
  const [admin, setAdmin] = useState(getTokens("admin")?.username || null);

  async function loginUser(username, password) {
    const res = await api.post("/auth/token/", { username, password });
    saveTokens("user", res.data);   // access, refresh, username
    setUser(res.data.username);
  }

  async function register(username, password) {
    await api.post("/auth/register/", { username, password });
    await loginUser(username, password);
  }

  function logoutUser() {
    clearTokens("user");   // logout = forget the tokens in this browser
    setUser(null);
  }

  async function loginAdmin(username, password) {
    const res = await api.post("/admin/auth/token/", { username, password });
    saveTokens("admin", res.data);
    setAdmin(res.data.username);
  }

  function logoutAdmin() {
    clearTokens("admin");
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ user, admin, loginUser, register, logoutUser, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}