import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const savedUser = localStorage.getItem('hospital_mis_user');
const savedToken = localStorage.getItem('hospital_mis_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : {
    id: 1,
    username: 'admin',
    role: 'SUPER_ADMIN',
    isActive: true,
  },
  token: savedToken || 'demo-jwt-token',
  isAuthenticated: true, // Default to demo session for instant testing
  login: (user, token) => {
    localStorage.setItem('hospital_mis_user', JSON.stringify(user));
    localStorage.setItem('hospital_mis_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('hospital_mis_user');
    localStorage.removeItem('hospital_mis_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
