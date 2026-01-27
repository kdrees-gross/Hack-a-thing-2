import { useState } from 'react';
import { User } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function login(username: string, password: string) {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setUser(data);
  }

  function logout() {
    setUser(null);
  }

  return { user, login, logout };
}