import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
  hasPermission: (moduleKey: string) => boolean;
}

const savedUserRaw = localStorage.getItem('hospital_mis_user');
const savedToken = localStorage.getItem('hospital_mis_token');

let initialUser: User | null = null;
try {
  if (savedUserRaw) {
    initialUser = JSON.parse(savedUserRaw);
  }
} catch (e) {
  initialUser = null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  token: savedToken || null,
  isAuthenticated: !!(initialUser && savedToken),
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
  updateCurrentUser: (data) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    try {
      localStorage.setItem('hospital_mis_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    set({ user: updated });
  },
  hasPermission: (moduleKey: string) => {
    const user = get().user;
    if (!user) return false;
    // Super admin has unrestricted access to all modules
    if (user.isSuperAdmin || user.role === 'SUPER_ADMIN') return true;
    if (!user.permissions || !Array.isArray(user.permissions)) return false;
    return user.permissions.includes(moduleKey);
  },
}));
