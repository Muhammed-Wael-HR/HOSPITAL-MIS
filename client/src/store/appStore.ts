import { create } from 'zustand';

// ============================================================
// Hospital Settings (persisted in localStorage)
// ============================================================

export interface HospitalSettings {
  nameAr: string;
  nameEn: string;
  phone: string;
  hotline: string;
  email: string;
  address: string;
  taxNumber: string;
  commercialReg: string;
  gaharCode: string;
}

// ============================================================
// Admin / User Profile (persisted in localStorage)
// ============================================================

export interface AdminProfile {
  displayName: string;
  position: string;
  phone: string;
  email: string;
}

// ============================================================
// App State
// ============================================================

interface AppState {
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;

  // Hospital identity
  hospitalSettings: HospitalSettings;
  setHospitalSettings: (settings: Partial<HospitalSettings>) => void;

  // Admin profile
  adminProfile: AdminProfile;
  setAdminProfile: (profile: Partial<AdminProfile>) => void;

  // Actions
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// Default values
const DEFAULT_HOSPITAL: HospitalSettings = {
  nameAr: 'مستشفى النيل التخصصي',
  nameEn: 'Nile Specialized Hospital',
  phone: '0223456789',
  hotline: '19876',
  email: 'info@nile-hospital.eg',
  address: 'شارع النصر - المعادي الجديدة - القاهرة',
  taxNumber: '789-456-123',
  commercialReg: '98451 - استثمار القاهرة',
  gaharCode: 'GAHAR-HOSP-2026-0812',
};

const DEFAULT_ADMIN: AdminProfile = {
  displayName: 'د. محمد حسني',
  position: 'مدير النظام الطبي',
  phone: '01012345678',
  email: 'admin@nile-hospital.eg',
};

// Load from localStorage
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const useAppStore = create<AppState>((set) => ({
  language: 'ar',
  direction: 'rtl',
  theme: 'light',
  sidebarCollapsed: false,

  hospitalSettings: loadFromStorage<HospitalSettings>('hospital_mis_settings', DEFAULT_HOSPITAL),
  adminProfile: loadFromStorage<AdminProfile>('hospital_mis_admin', DEFAULT_ADMIN),

  setLanguage: (lang) => {
    set({
      language: lang,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    });
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  },

  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  setHospitalSettings: (updates) => {
    set((state) => {
      const merged = { ...state.hospitalSettings, ...updates };
      localStorage.setItem('hospital_mis_settings', JSON.stringify(merged));
      // Also update the page title dynamically
      document.title = `${merged.nameAr} - نظام المعلومات`;
      return { hospitalSettings: merged };
    });
  },

  setAdminProfile: (updates) => {
    set((state) => {
      const merged = { ...state.adminProfile, ...updates };
      localStorage.setItem('hospital_mis_admin', JSON.stringify(merged));
      return { adminProfile: merged };
    });
  },
}));
