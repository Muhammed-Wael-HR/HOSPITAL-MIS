import { create } from 'zustand';
import {
  Patient,
  Department,
  Room,
  Bed,
  Employee,
  Doctor,
  Appointment,
  Admission,
  VitalSign,
  MedicalRecord,
  LabTest,
  LabOrder,
  RadiologyType,
  RadiologyOrder,
  Medication,
  Prescription,
  Invoice,
  InsuranceCompany,
  InsuranceClaim,
  Archive,
  User,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_DEPARTMENTS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_EMPLOYEES,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_ADMISSIONS,
  INITIAL_VITALS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_ORDERS,
  INITIAL_RADIOLOGY_TYPES,
  INITIAL_RADIOLOGY_ORDERS,
  INITIAL_MEDICATIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_INSURANCE_COMPANIES,
  INITIAL_CLAIMS,
  INITIAL_ARCHIVES,
  INITIAL_USERS,
} from './initialData';

interface HospitalStoreState {
  users: User[];
  patients: Patient[];
  departments: Department[];
  rooms: Room[];
  beds: Bed[];
  employees: Employee[];
  doctors: Doctor[];
  appointments: Appointment[];
  admissions: Admission[];
  vitals: VitalSign[];
  medicalRecords: MedicalRecord[];
  labTests: LabTest[];
  labOrders: LabOrder[];
  radiologyTypes: RadiologyType[];
  radiologyOrders: RadiologyOrder[];
  medications: Medication[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  insuranceCompanies: InsuranceCompany[];
  claims: InsuranceClaim[];
  archives: Archive[];

  // Department Actions
  addDepartment: (dept: Partial<Department>) => void;
  updateDepartment: (id: number, dept: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;

  // Patient Actions
  addPatient: (patient: Partial<Patient>) => Patient;
  updatePatient: (id: number, patient: Partial<Patient>) => void;
  deletePatient: (id: number) => void;

  // Appointment Actions
  addAppointment: (appointment: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;

  // Admission Actions
  admitPatient: (admission: { patientId: number; doctorId: number; bedId: number; reason?: string }) => void;
  dischargePatient: (id: number, summary?: string) => void;
  transferBed: (admissionId: number, newBedId: number, reason?: string) => void;

  // Vital signs
  addVitalSign: (vital: Partial<VitalSign>) => void;

  // Medical Record Actions
  addMedicalRecord: (record: Partial<MedicalRecord>) => void;

  // Lab Actions
  createLabOrder: (order: { patientId: number; doctorId: number; testIds: number[]; priority?: string; notes?: string }) => void;
  enterLabResult: (orderId: number, results: { testId: number; resultValue: string; isAbnormal: boolean; notes?: string }[]) => void;
  approveLabOrder: (orderId: number) => void;

  // Radiology Actions
  createRadiologyOrder: (order: { patientId: number; doctorId: number; typeId: number; clinicalInfo?: string }) => void;
  addRadiologyReport: (orderId: number, report: string) => void;

  // Pharmacy Actions
  dispensePrescription: (prescriptionId: number) => void;
  addMedication: (med: Partial<Medication>) => void;
  updateStock: (medicationId: number, quantityChange: number) => void;

  // Billing Actions
  createInvoice: (invoice: Partial<Invoice>) => Invoice;
  payInvoice: (invoiceId: number, amount: number, method: Invoice['paymentMethod'], reference?: string) => void;

  // Insurance Actions
  submitClaim: (invoiceId: number, companyId: number, amount: number) => void;
  updateClaimStatus: (claimId: number, status: InsuranceClaim['status'], approvedAmount?: number) => void;

  // Archive Actions (DMS)
  addArchiveDocument: (doc: {
    patientId?: number;
    title: string;
    description?: string;
    category: Archive['category'];
    fileType: string;
    fileName: string;
    fileSize: number;
    tags?: string;
  }) => void;
  deleteArchiveDocument: (id: number) => void;

  // User & Admin Management (نظام إدارة المسؤولين والصلاحيات)
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: number, data: Partial<User>) => void;
  deleteUser: (id: number) => void;
  toggleUserStatus: (id: number) => void;
}

// Persistent collection loader helper
const loadCollection = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`hospital_mis_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
    }
  } catch {}
  return fallback;
};

export const useHospitalStore = create<HospitalStoreState>((set, get) => ({
  users: loadCollection<User[]>('custom_users', INITIAL_USERS),
  patients: loadCollection<Patient[]>('patients', INITIAL_PATIENTS),
  departments: loadCollection<Department[]>('departments', INITIAL_DEPARTMENTS),
  rooms: INITIAL_ROOMS,
  beds: loadCollection<Bed[]>('beds', INITIAL_BEDS),
  employees: INITIAL_EMPLOYEES,
  doctors: INITIAL_DOCTORS,
  appointments: loadCollection<Appointment[]>('appointments', INITIAL_APPOINTMENTS),
  admissions: loadCollection<Admission[]>('admissions', INITIAL_ADMISSIONS),
  vitals: INITIAL_VITALS,
  medicalRecords: INITIAL_MEDICAL_RECORDS,
  labTests: INITIAL_LAB_TESTS,
  labOrders: INITIAL_LAB_ORDERS,
  radiologyTypes: INITIAL_RADIOLOGY_TYPES,
  radiologyOrders: INITIAL_RADIOLOGY_ORDERS,
  medications: loadCollection<Medication[]>('medications', INITIAL_MEDICATIONS),
  prescriptions: INITIAL_PRESCRIPTIONS,
  invoices: loadCollection<Invoice[]>('invoices', INITIAL_INVOICES),
  insuranceCompanies: INITIAL_INSURANCE_COMPANIES,
  claims: INITIAL_CLAIMS,
  archives: loadCollection<Archive[]>('archives', INITIAL_ARCHIVES),

  // Department implementations
  addDepartment: (dept) => {
    const newId = get().departments.length > 0 ? Math.max(...get().departments.map((d) => d.id)) + 1 : 1;
    const newDept: Department = {
      id: newId,
      nameAr: dept.nameAr || 'قسم طبي جديد',
      nameEn: dept.nameEn || 'New Department',
      type: dept.type || 'عيادات تخصصية',
      description: dept.description || '',
      isActive: dept.isActive !== undefined ? dept.isActive : true,
    };
    set((state) => ({ departments: [...state.departments, newDept] }));
  },

  updateDepartment: (id, data) => {
    set((state) => ({
      departments: state.departments.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }));
  },

  deleteDepartment: (id) => {
    set((state) => ({
      departments: state.departments.filter((d) => d.id !== id),
    }));
  },

  // Patient implementations
  addPatient: (data) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newId = get().patients.length + 1;
    const mrn = `MRN-${today}-${newId.toString().padStart(4, '0')}`;
    const newPatient: Patient = {
      id: newId,
      mrn,
      fullNameAr: data.fullNameAr || 'مريض جديد',
      fullNameEn: data.fullNameEn || '',
      nationalId: data.nationalId || '',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      gender: data.gender || 'MALE',
      bloodType: data.bloodType || 'O_POSITIVE',
      allergies: data.allergies || 'لا توجد',
      phone: data.phone || '',
      phone2: data.phone2 || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || 'القاهرة',
      emergencyContact: data.emergencyContact || '',
      emergencyPhone: data.emergencyPhone || '',
      notes: data.notes || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ patients: [newPatient, ...state.patients] }));
    return newPatient;
  },

  updatePatient: (id, data) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deletePatient: (id) => {
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    }));
  },

  // Appointment implementations
  addAppointment: (data) => {
    const newId = get().appointments.length + 1;
    const patient = get().patients.find((p) => p.id === data.patientId);
    const doctor = get().doctors.find((d) => d.id === data.doctorId);
    const newApp: Appointment = {
      id: newId,
      patientId: data.patientId || 1,
      patient,
      doctorId: data.doctorId || 1,
      doctor,
      scheduledAt: data.scheduledAt || new Date().toISOString(),
      status: 'SCHEDULED',
      type: data.type || 'CONSULTATION',
      notes: data.notes || '',
    };
    set((state) => ({ appointments: [newApp, ...state.appointments] }));
  },

  updateAppointmentStatus: (id, status) => {
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  },

  // Admissions (ADT)
  admitPatient: ({ patientId, doctorId, bedId, reason }) => {
    const newId = get().admissions.length + 1;
    const patient = get().patients.find((p) => p.id === patientId);
    const doctor = get().doctors.find((d) => d.id === doctorId);
    const bed = get().beds.find((b) => b.id === bedId);

    const newAdmission: Admission = {
      id: newId,
      patientId,
      patient,
      doctorId,
      doctor,
      bedId,
      bed,
      admittedAt: new Date().toISOString(),
      status: 'ADMITTED',
      admissionReason: reason || 'دخول مستشفى للمتابعة والعلاج',
    };

    set((state) => ({
      admissions: [newAdmission, ...state.admissions],
      beds: state.beds.map((b) => (b.id === bedId ? { ...b, status: 'OCCUPIED' } : b)),
    }));
  },

  dischargePatient: (id, summary) => {
    const adm = get().admissions.find((a) => a.id === id);
    if (!adm) return;

    set((state) => ({
      admissions: state.admissions.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'DISCHARGED',
              dischargedAt: new Date().toISOString(),
              dischargeSummary: summary || 'تم إنهاء الإقامة والخروج بحالة مستقرة',
            }
          : a
      ),
      beds: state.beds.map((b) => (b.id === adm.bedId ? { ...b, status: 'AVAILABLE' } : b)),
    }));
  },

  transferBed: (admissionId, newBedId, reason) => {
    const adm = get().admissions.find((a) => a.id === admissionId);
    if (!adm) return;

    const oldBedId = adm.bedId;
    const newBed = get().beds.find((b) => b.id === newBedId);

    set((state) => ({
      admissions: state.admissions.map((a) =>
        a.id === admissionId
          ? {
              ...a,
              bedId: newBedId,
              bed: newBed,
              admissionReason: `${a.admissionReason || ''} (نُقل للسرير ${newBed?.bedNumber} - السبب: ${reason || 'قرار طبي'})`,
            }
          : a
      ),
      beds: state.beds.map((b) => {
        if (b.id === oldBedId) return { ...b, status: 'AVAILABLE' };
        if (b.id === newBedId) return { ...b, status: 'OCCUPIED' };
        return b;
      }),
    }));
  },

  addVitalSign: (data) => {
    const newVital: VitalSign = {
      id: get().vitals.length + 1,
      patientId: data.patientId || 1,
      admissionId: data.admissionId,
      temperature: data.temperature || 37.0,
      bpSystolic: data.bpSystolic || 120,
      bpDiastolic: data.bpDiastolic || 80,
      heartRate: data.heartRate || 75,
      respiratoryRate: data.respiratoryRate || 16,
      oxygenSaturation: data.oxygenSaturation || 98,
      weight: data.weight,
      height: data.height,
      recordedAt: new Date().toISOString(),
      recordedBy: data.recordedBy || 'التمريض المسؤول',
    };
    set((state) => ({ vitals: [newVital, ...state.vitals] }));
  },

  // Medical Record (SOAP)
  addMedicalRecord: (data) => {
    const patient = get().patients.find((p) => p.id === data.patientId);
    const doctor = get().doctors.find((d) => d.id === data.doctorId);
    const newRecord: MedicalRecord = {
      id: get().medicalRecords.length + 1,
      patientId: data.patientId || 1,
      patient,
      doctorId: data.doctorId || 1,
      doctor,
      visitType: data.visitType || 'CONSULTATION',
      icd10Code: data.icd10Code || 'Z00.00',
      icd10Desc: data.icd10Desc || 'General adult medical examination',
      subjective: data.subjective || '',
      objective: data.objective || '',
      assessment: data.assessment || '',
      plan: data.plan || '',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ medicalRecords: [newRecord, ...state.medicalRecords] }));
  },

  // Lab
  createLabOrder: ({ patientId, doctorId, testIds, priority, notes }) => {
    const orderId = get().labOrders.length + 1;
    const orderNum = `LAB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${orderId.toString().padStart(4, '0')}`;
    const patient = get().patients.find((p) => p.id === patientId);
    const doctor = get().doctors.find((d) => d.id === doctorId);

    const results = testIds.map((tId, idx) => {
      const test = get().labTests.find((t) => t.id === tId);
      return {
        id: orderId * 100 + idx,
        orderId,
        testId: tId,
        test,
        resultValue: '',
        isAbnormal: false,
      };
    });

    const newOrder: LabOrder = {
      id: orderId,
      orderNumber: orderNum,
      patientId,
      patient,
      doctorId,
      doctor,
      status: 'PENDING',
      priority: (priority as any) || 'ROUTINE',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      results,
    };
    set((state) => ({ labOrders: [newOrder, ...state.labOrders] }));
  },

  enterLabResult: (orderId, resultsData) => {
    set((state) => ({
      labOrders: state.labOrders.map((order) => {
        if (order.id !== orderId) return order;
        const updatedResults = order.results?.map((res) => {
          const match = resultsData.find((r) => r.testId === res.testId);
          if (match) {
            return {
              ...res,
              resultValue: match.resultValue,
              isAbnormal: match.isAbnormal,
              notes: match.notes,
              performedBy: 'أخصائي المعمل',
              resultAt: new Date().toISOString(),
            };
          }
          return res;
        });
        return {
          ...order,
          results: updatedResults,
          status: 'COMPLETED',
        };
      }),
    }));
  },

  approveLabOrder: (orderId) => {
    set((state) => ({
      labOrders: state.labOrders.map((o) => (o.id === orderId ? { ...o, status: 'APPROVED' } : o)),
    }));
  },

  // Radiology
  createRadiologyOrder: ({ patientId, doctorId, typeId, clinicalInfo }) => {
    const orderId = get().radiologyOrders.length + 1;
    const orderNum = `RAD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${orderId.toString().padStart(4, '0')}`;
    const patient = get().patients.find((p) => p.id === patientId);
    const doctor = get().doctors.find((d) => d.id === doctorId);
    const type = get().radiologyTypes.find((t) => t.id === typeId);

    const newOrder: RadiologyOrder = {
      id: orderId,
      orderNumber: orderNum,
      patientId,
      patient,
      doctorId,
      doctor,
      typeId,
      type,
      status: 'PENDING',
      priority: 'ROUTINE',
      clinicalInfo: clinicalInfo || '',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ radiologyOrders: [newOrder, ...state.radiologyOrders] }));
  },

  addRadiologyReport: (orderId, report) => {
    set((state) => ({
      radiologyOrders: state.radiologyOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              report,
              status: 'REPORTED',
              images: [
                { id: o.id, orderId: o.id, fileName: `scan_${o.orderNumber}.jpg`, filePath: '/demo_images/radiology_sample.png' },
              ],
            }
          : o
      ),
    }));
  },

  // Pharmacy
  dispensePrescription: (prescriptionId) => {
    const pres = get().prescriptions.find((p) => p.id === prescriptionId);
    if (!pres) return;

    // Deduct stock for each medication
    pres.items?.forEach((item) => {
      get().updateStock(item.medicationId, -item.quantity);
    });

    set((state) => ({
      prescriptions: state.prescriptions.map((p) =>
        p.id === prescriptionId
          ? {
              ...p,
              status: 'DISPENSED',
              items: p.items?.map((it) => ({ ...it, dispensed: true })) || [],
            }
          : p
      ),
    }));
  },

  addMedication: (data) => {
    const newMed: Medication = {
      id: get().medications.length + 1,
      code: `MED-${Date.now().toString().slice(-6)}`,
      tradeName: data.tradeName || 'دواء جديد',
      genericName: data.genericName || '',
      form: data.form || 'TABLET',
      strength: data.strength || '',
      manufacturer: data.manufacturer || 'شركة أدوية معتمدة',
      category: data.category || 'عام',
      price: data.price || 50,
      currentStock: data.currentStock || 100,
      minimumStock: data.minimumStock || 20,
      expiryDate: data.expiryDate || '2028-01-01',
      isControlled: data.isControlled || false,
      isActive: true,
    };
    set((state) => ({ medications: [newMed, ...state.medications] }));
  },

  updateStock: (medicationId, quantityChange) => {
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === medicationId
          ? { ...m, currentStock: Math.max(0, m.currentStock + quantityChange) }
          : m
      ),
    }));
  },

  // Billing
  createInvoice: (data) => {
    const invoiceId = get().invoices.length + 1;
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${invoiceId.toString().padStart(4, '0')}`;
    const patient = get().patients.find((p) => p.id === data.patientId);

    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber,
      patientId: data.patientId || 1,
      patient,
      subtotal: data.subtotal || 0,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total: data.total || 0,
      paid: data.paid || 0,
      status: data.status || 'DRAFT',
      paymentMethod: data.paymentMethod || 'CASH',
      notes: data.notes || '',
      items: data.items || [],
      payments: data.payments || [],
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
    return newInvoice;
  },

  payInvoice: (invoiceId, amount, method, reference) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = Number(inv.paid) + amount;
        const isFull = newPaid >= Number(inv.total);
        const newPayment = {
          id: Date.now(),
          invoiceId,
          amount,
          method: (method as any) || 'CASH',
          reference: reference || `REC-${Date.now().toString().slice(-6)}`,
          paidAt: new Date().toISOString(),
        };
        return {
          ...inv,
          paid: newPaid,
          status: isFull ? 'PAID' : 'PARTIALLY_PAID',
          payments: [...(inv.payments || []), newPayment],
        };
      }),
    }));
  },

  // Insurance
  submitClaim: (invoiceId, companyId, amount) => {
    const claimId = get().claims.length + 1;
    const claimNumber = `CLM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${claimId.toString().padStart(3, '0')}`;
    const company = get().insuranceCompanies.find((c) => c.id === companyId);

    const newClaim: InsuranceClaim = {
      id: claimId,
      claimNumber,
      invoiceId,
      companyId,
      company,
      claimedAmount: amount,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };
    set((state) => ({ claims: [newClaim, ...state.claims] }));
  },

  updateClaimStatus: (claimId, status, approvedAmount) => {
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === claimId ? { ...c, status, approvedAmount: approvedAmount ?? c.approvedAmount } : c
      ),
    }));
  },

  // 🗂️ Archive Operations (نظام الأرشيف وإدارة المستندات)
  addArchiveDocument: (doc) => {
    const patient = doc.patientId ? get().patients.find((p) => p.id === doc.patientId) : undefined;
    const newArchive: Archive = {
      id: get().archives.length + 1,
      patientId: doc.patientId,
      patient,
      title: doc.title,
      description: doc.description || '',
      category: doc.category,
      fileType: doc.fileType,
      fileName: doc.fileName,
      filePath: `/uploads/archive/${doc.fileName}`,
      fileSize: doc.fileSize,
      uploadedBy: 1, // Admin or current user
      tags: doc.tags || '',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ archives: [newArchive, ...state.archives] }));
  },

  deleteArchiveDocument: (id) => {
    set((state) => ({
      archives: state.archives.filter((a) => a.id !== id),
    }));
  },

  // 👥 User & Admin Operations (إدارة المسؤولين والصلاحيات)
  addUser: (userData) => {
    const currentUsers = get().users;
    const newId = currentUsers.length > 0 ? Math.max(...currentUsers.map((u) => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      username: userData.username.trim().toLowerCase(),
      password: userData.password || '123456',
      fullName: userData.fullName || 'مسؤول نظام جديد',
      role: userData.role || 'ADMIN',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      permissions: userData.permissions && userData.permissions.length > 0 ? userData.permissions : ['dashboard'],
      isSuperAdmin: false,
      createdAt: new Date().toISOString(),
      phone: userData.phone || '',
      notes: userData.notes || '',
    };
    const updated = [...currentUsers, newUser];
    try {
      localStorage.setItem('hospital_mis_custom_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    set({ users: updated });
    return newUser;
  },

  updateUser: (id, data) => {
    const updated = get().users.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          ...data,
          username: data.username ? data.username.trim().toLowerCase() : u.username,
        };
      }
      return u;
    });
    try {
      localStorage.setItem('hospital_mis_custom_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    set({ users: updated });
  },

  deleteUser: (id) => {
    const user = get().users.find((u) => u.id === id);
    if (user?.isSuperAdmin) {
      return; // Cannot delete master super admin
    }
    const updated = get().users.filter((u) => u.id !== id);
    try {
      localStorage.setItem('hospital_mis_custom_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    set({ users: updated });
  },

  toggleUserStatus: (id) => {
    const updated = get().users.map((u) => {
      if (u.id === id && !u.isSuperAdmin) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    try {
      localStorage.setItem('hospital_mis_custom_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    set({ users: updated });
  },
}));

// Automatic persistence subscriber
useHospitalStore.subscribe((state) => {
  try {
    localStorage.setItem('hospital_mis_custom_users', JSON.stringify(state.users));
    localStorage.setItem('hospital_mis_patients', JSON.stringify(state.patients));
    localStorage.setItem('hospital_mis_departments', JSON.stringify(state.departments));
    localStorage.setItem('hospital_mis_beds', JSON.stringify(state.beds));
    localStorage.setItem('hospital_mis_appointments', JSON.stringify(state.appointments));
    localStorage.setItem('hospital_mis_admissions', JSON.stringify(state.admissions));
    localStorage.setItem('hospital_mis_medications', JSON.stringify(state.medications));
    localStorage.setItem('hospital_mis_invoices', JSON.stringify(state.invoices));
    localStorage.setItem('hospital_mis_archives', JSON.stringify(state.archives));
  } catch (e) {
    console.warn('Storage auto-persist notice:', e);
  }
});
