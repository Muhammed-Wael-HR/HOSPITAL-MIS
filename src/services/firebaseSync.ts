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
      if (cloudData.patients) useHospitalStore.setState({ patients: cloudData.patients });
      if (cloudData.departments) useHospitalStore.setState({ departments: cloudData.departments });
      if (cloudData.appointments) useHospitalStore.setState({ appointments: cloudData.appointments });
      if (cloudData.admissions) useHospitalStore.setState({ admissions: cloudData.admissions });
      if (cloudData.beds) useHospitalStore.setState({ beds: cloudData.beds });
      if (cloudData.vitals) useHospitalStore.setState({ vitals: cloudData.vitals });
      if (cloudData.medicalRecords) useHospitalStore.setState({ medicalRecords: cloudData.medicalRecords });
      if (cloudData.labOrders) useHospitalStore.setState({ labOrders: cloudData.labOrders });
      if (cloudData.radiologyOrders) useHospitalStore.setState({ radiologyOrders: cloudData.radiologyOrders });
      if (cloudData.medications) useHospitalStore.setState({ medications: cloudData.medications });
      if (cloudData.prescriptions) useHospitalStore.setState({ prescriptions: cloudData.prescriptions });
      if (cloudData.invoices) useHospitalStore.setState({ invoices: cloudData.invoices });
      if (cloudData.claims) useHospitalStore.setState({ claims: cloudData.claims });
      if (cloudData.archives) useHospitalStore.setState({ archives: cloudData.archives });
      if (cloudData.users && Array.isArray(cloudData.users) && cloudData.users.length > 0) {
        useHospitalStore.setState({ users: cloudData.users });
        try {
          localStorage.setItem('hospital_mis_custom_users', JSON.stringify(cloudData.users));
        } catch (e) {}
      }

      // Update App Identity / Admin Profile
      if (cloudData.hospitalSettings) {
        useAppStore.setState({ hospitalSettings: cloudData.hospitalSettings });
        document.title = `${cloudData.hospitalSettings.nameAr || 'المستشفى'} - نظام المعلومات الصحي`;
      }
      if (cloudData.adminProfile) {
        useAppStore.setState({ adminProfile: cloudData.adminProfile });
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
