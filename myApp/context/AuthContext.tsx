import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'worker' | 'poster';

type User = {
  id: string;
  username: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<User>;
  signup: (username: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://127.0.0.1:4000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function login(username: string, password: string) {
    console.log('Login called with:', username);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      console.log('Login failed, response not ok');
      throw new Error('Invalid credentials');
    }

    const data = await res.json();
    console.log('Login successful, user data:', data.user);
    setUser(data.user);
    setToken(data.token);
    console.log('User state set to:', data.user);
    return data.user;
  }

  async function signup(username: string, password: string, role: Role) {
    console.log('Signup called with:', username, role);
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    if (!res.ok) {
      console.log('Signup failed, response not ok');
      throw new Error('Signup failed');
    }

    const data = await res.json();
    console.log('Signup successful, user data:', data.user);
    setUser(data.user);
    setToken(data.token);
    console.log('User state set to:', data.user);
    return data.user;
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  console.log('AuthContext rendering, current user:', user);

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  console.log('useAuth called, returning user:', ctx.user);
  return ctx;
}
