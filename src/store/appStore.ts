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
  nameAr: 'فريق الإخلاء الطبي (MEDEVAC TEAM)',
  nameEn: 'MEDEVAC TEAM - Medical Evacuation & Emergency HIS',
  phone: '01012345678',
  hotline: '19876',
  email: 'ops@medevac-team.org',
  address: 'مقر القيادة العامة للإخلاء الطبي والطوارئ - القاهرة',
  taxNumber: '789-456-123',
  commercialReg: '98451 - ترخيص الإخلاء الطبي',
  gaharCode: 'GAHAR-MEDEVAC-2026',
};

const DEFAULT_ADMIN: AdminProfile = {
  displayName: 'قائد الفريق الطبي (MEDEVAC COMMANDER)',
  position: 'المشرف العام والمسؤول الأساسي',
  phone: '01000000001',
  email: 'commander@medevac-team.org',
};

// Load from localStorage with smart upgrade
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // If it has old legacy name 'مستشفى النيل', modernize it to MEDEVAC TEAM
    if (key === 'hospital_mis_settings' && parsed.nameAr && parsed.nameAr.includes('النيل')) {
      localStorage.setItem('hospital_mis_settings', JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
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
      try {
        localStorage.setItem('hospital_mis_settings', JSON.stringify(merged));
      } catch (e) {}
      // Update page title dynamically
      document.title = `${merged.nameAr} - نظام المعلومات`;
      return { hospitalSettings: merged };
    });
  },

  setAdminProfile: (updates) => {
    set((state) => {
      const merged = { ...state.adminProfile, ...updates };
      try {
        localStorage.setItem('hospital_mis_admin', JSON.stringify(merged));
        // Sync with active user in localStorage
        const rawUser = localStorage.getItem('hospital_mis_user');
        if (rawUser) {
          const userObj = JSON.parse(rawUser);
          if (merged.displayName) userObj.fullName = merged.displayName;
          localStorage.setItem('hospital_mis_user', JSON.stringify(userObj));
        }
      } catch (e) {}
      return { adminProfile: merged };
    });
  },
}));
