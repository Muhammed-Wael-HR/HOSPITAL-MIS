/**
 * Hospital MIS - Cloud Database Integration (Firebase Firestore)
 * Enables live real-time sync across all devices when deployed on Vercel / Web,
 * matching the user's HR system architecture with zero-dependency CDN fallback.
 */

import { useHospitalStore } from '../mockData/mockStore';
import { useAppStore } from '../store/appStore';

declare global {
  interface Window {
    firebase?: any;
  }
}

// Default Firebase Configuration (pre-configured with fallback to custom stored config)
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCJGe_MnPLTfSd5fXxEgr9j8Kg34RwXE5k",
  authDomain: "emak-hr.firebaseapp.com",
  projectId: "emak-hr",
  storageBucket: "emak-hr.firebasestorage.app",
  messagingSenderId: "735376650845",
  appId: "1:735376650845:web:ef768610a74d3e7dbe53b4",
  measurementId: "G-DKGH4DWMH0"
};

class FirebaseSyncManager {
  private db: any = null;
  private isConnected: boolean = false;
  private isUpdatingFromCloud: boolean = false;
  private syncTimeout: any = null;
  private statusListeners: Array<(status: 'connected' | 'offline' | 'syncing' | 'error', details?: string) => void> = [];

  constructor() {
    this.init();
  }

  public getStatus(): { isConnected: boolean } {
    return { isConnected: this.isConnected };
  }

  public onStatusChange(callback: (status: 'connected' | 'offline' | 'syncing' | 'error', details?: string) => void) {
    this.statusListeners.push(callback);
    callback(this.isConnected ? 'connected' : 'offline');
    return () => {
      this.statusListeners = this.statusListeners.filter((cb) => cb !== callback);
    };
  }

  private notify(status: 'connected' | 'offline' | 'syncing' | 'error', details?: string) {
    this.statusListeners.forEach((cb) => cb(status, details));
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Check if Firebase CDN loaded
    if (!window.firebase || !window.firebase.firestore) {
      console.warn('[FirebaseSync] Firebase SDK not yet available. Waiting for CDN load...');
      setTimeout(() => this.init(), 1000);
      return;
    }

    try {
      const savedConfig = localStorage.getItem('hospital_mis_firebase_config');
      const config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_FIREBASE_CONFIG;

      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(config);
      }
      this.db = window.firebase.firestore();
      this.isConnected = true;
      this.notify('connected');
      console.log('[FirebaseSync] Connected to Cloud Firestore successfully.');

      // Start initial sync and listeners
      this.startSync();
    } catch (err: any) {
      console.warn('[FirebaseSync] Failed to initialize Firebase:', err);
      this.isConnected = false;
      this.notify('offline', err.message);
    }
  }

  private async startSync() {
    if (!this.db) return;

    const docRef = this.db.collection('hospital_mis').doc('hospital_data_v1');

    try {
      this.notify('syncing');
      const doc = await docRef.get();

      if (doc.exists) {
        const cloudData = doc.data();
        this.applyCloudData(cloudData);
        console.log('[FirebaseSync] Loaded initial data from Cloud Firestore.');
      } else {
        // First time initialization in Firestore - upload initial seed
        console.log('[FirebaseSync] Document does not exist in Firestore. Seeding initial data...');
        this.pushLocalToCloud();
      }
      this.notify('connected');
    } catch (err: any) {
      console.warn('[FirebaseSync] Could not fetch initial document from Firestore:', err);
      this.notify('error', err.message);
    }

    // Subscribe to real-time updates from other clients/devices
    docRef.onSnapshot(
      (snapshot: any) => {
        if (!snapshot.exists) return;
        if (this.isUpdatingFromCloud) return;

        const data = snapshot.data();
        this.applyCloudData(data);
        console.log('[FirebaseSync] Real-time update received from Cloud Firestore.');
      },
      (error: any) => {
        console.warn('[FirebaseSync] onSnapshot listener error:', error);
      }
    );

    // Watch local state changes to auto-push (debounced)
    useHospitalStore.subscribe(() => {
      if (this.isUpdatingFromCloud) return;
      this.schedulePush();
    });

    useAppStore.subscribe(() => {
      if (this.isUpdatingFromCloud) return;
      this.schedulePush();
    });
  }

  private applyCloudData(cloudData: any) {
    if (!cloudData) return;
    this.isUpdatingFromCloud = true;

    try {
      const hospitalStore = useHospitalStore.getState();
      const appStore = useAppStore.getState();

      // Update Hospital Store state
      if (cloudData.patients) {
        useHospitalStore.setState({ patients: cloudData.patients });
        try { localStorage.setItem('hospital_mis_patients', JSON.stringify(cloudData.patients)); } catch (e) {}
      }
      if (cloudData.departments) {
        useHospitalStore.setState({ departments: cloudData.departments });
        try { localStorage.setItem('hospital_mis_departments', JSON.stringify(cloudData.departments)); } catch (e) {}
      }
      if (cloudData.appointments) {
        useHospitalStore.setState({ appointments: cloudData.appointments });
        try { localStorage.setItem('hospital_mis_appointments', JSON.stringify(cloudData.appointments)); } catch (e) {}
      }
      if (cloudData.admissions) {
        useHospitalStore.setState({ admissions: cloudData.admissions });
        try { localStorage.setItem('hospital_mis_admissions', JSON.stringify(cloudData.admissions)); } catch (e) {}
      }
      if (cloudData.beds) {
        useHospitalStore.setState({ beds: cloudData.beds });
        try { localStorage.setItem('hospital_mis_beds', JSON.stringify(cloudData.beds)); } catch (e) {}
      }
      if (cloudData.vitals) useHospitalStore.setState({ vitals: cloudData.vitals });
      if (cloudData.medicalRecords) useHospitalStore.setState({ medicalRecords: cloudData.medicalRecords });
      if (cloudData.labOrders) useHospitalStore.setState({ labOrders: cloudData.labOrders });
      if (cloudData.radiologyOrders) useHospitalStore.setState({ radiologyOrders: cloudData.radiologyOrders });
      if (cloudData.medications) {
        useHospitalStore.setState({ medications: cloudData.medications });
        try { localStorage.setItem('hospital_mis_medications', JSON.stringify(cloudData.medications)); } catch (e) {}
      }
      if (cloudData.prescriptions) useHospitalStore.setState({ prescriptions: cloudData.prescriptions });
      if (cloudData.invoices) {
        useHospitalStore.setState({ invoices: cloudData.invoices });
        try { localStorage.setItem('hospital_mis_invoices', JSON.stringify(cloudData.invoices)); } catch (e) {}
      }
      if (cloudData.claims) useHospitalStore.setState({ claims: cloudData.claims });
      if (cloudData.archives) {
        useHospitalStore.setState({ archives: cloudData.archives });
        try { localStorage.setItem('hospital_mis_archives', JSON.stringify(cloudData.archives)); } catch (e) {}
      }
      if (cloudData.users && Array.isArray(cloudData.users) && cloudData.users.length > 0) {
        useHospitalStore.setState({ users: cloudData.users });
        try {
          localStorage.setItem('hospital_mis_custom_users', JSON.stringify(cloudData.users));
        } catch (e) {}
      }

      // Update App Identity / Admin Profile (protect MEDEVAC TEAM from legacy overwrite)
      if (cloudData.hospitalSettings) {
        if (!cloudData.hospitalSettings.nameAr || !cloudData.hospitalSettings.nameAr.includes('النيل')) {
          useAppStore.setState({ hospitalSettings: cloudData.hospitalSettings });
          try { localStorage.setItem('hospital_mis_settings', JSON.stringify(cloudData.hospitalSettings)); } catch (e) {}
          document.title = `${cloudData.hospitalSettings.nameAr || 'MEDEVAC TEAM'} - نظام المعلومات الصحي`;
        } else {
          // Cloud has legacy old name 'مستشفى النيل', immediately push MEDEVAC TEAM to cloud!
          setTimeout(() => this.pushLocalToCloud(), 1000);
        }
      }
      if (cloudData.adminProfile) {
        useAppStore.setState({ adminProfile: cloudData.adminProfile });
        try { localStorage.setItem('hospital_mis_admin', JSON.stringify(cloudData.adminProfile)); } catch (e) {}
      }
    } finally {
      setTimeout(() => {
        this.isUpdatingFromCloud = false;
      }, 300);
    }
  }

  public schedulePush() {
    if (!this.db || !this.isConnected) return;
    if (this.syncTimeout) clearTimeout(this.syncTimeout);

    this.syncTimeout = setTimeout(() => {
      this.pushLocalToCloud();
    }, 800);
  }

  public async pushLocalToCloud() {
    if (!this.db || !this.isConnected) return;

    try {
      this.notify('syncing');
      const hospitalState = useHospitalStore.getState();
      const appState = useAppStore.getState();

      const payload = {
        updatedAt: new Date().toISOString(),
        patients: hospitalState.patients,
        departments: hospitalState.departments,
        appointments: hospitalState.appointments,
        admissions: hospitalState.admissions,
        beds: hospitalState.beds,
        vitals: hospitalState.vitals,
        medicalRecords: hospitalState.medicalRecords,
        labOrders: hospitalState.labOrders,
        radiologyOrders: hospitalState.radiologyOrders,
        medications: hospitalState.medications,
        prescriptions: hospitalState.prescriptions,
        invoices: hospitalState.invoices,
        claims: hospitalState.claims,
        archives: hospitalState.archives,
        users: hospitalState.users,
        hospitalSettings: appState.hospitalSettings,
        adminProfile: appState.adminProfile,
      };

      await this.db.collection('hospital_mis').doc('hospital_data_v1').set(payload, { merge: true });
      this.notify('connected');
      console.log('[FirebaseSync] Changes successfully pushed to Cloud Firestore.');
    } catch (err: any) {
      console.warn('[FirebaseSync] Failed to push changes to Firestore:', err);
      this.notify('error', err.message);
    }
  }

  public updateConfig(newConfig: any) {
    localStorage.setItem('hospital_mis_firebase_config', JSON.stringify(newConfig));
    window.location.reload();
  }
}

export const firebaseSync = new FirebaseSyncManager();
