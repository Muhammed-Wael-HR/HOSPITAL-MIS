/**
 * Hospital MIS - Type Definitions
 * Complete TypeScript interfaces matching the backend models.
 */

// ============================================================
// User & Authentication Types
// ============================================================

/** Available user roles in the system */
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'LAB_TECH'
  | 'RADIOLOGY_TECH'
  | 'PHARMACIST'
  | 'RECEPTIONIST'
  | 'ACCOUNTANT'
  | 'HR'
  | 'ARCHIVIST';

/** System user with RBAC permissions */
export interface User {
  id: number;
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  employeeId?: number;
  permissions: string[]; // List of module keys e.g. ['dashboard', 'patients', 'appointments']
  isSuperAdmin?: boolean;
  createdAt?: string;
  phone?: string;
  notes?: string;
}

/** System Module definition for granular access control */
export interface SystemModule {
  key: string;
  path: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  iconName?: string;
}

export const ALL_SYSTEM_MODULES: SystemModule[] = [
  { key: 'dashboard', path: '/', nameAr: 'لوحة التحكم الرئيسية', nameEn: 'Dashboard', descriptionAr: 'المؤشرات والرسوم البيانية وسير العمل العام' },
  { key: 'patients', path: '/patients', nameAr: 'سجل المرضى والملفات الطبية', nameEn: 'Patients Directory', descriptionAr: 'تسجيل المرضى، عرض الملف الطبي الشامل، وتعديل البيانات' },
  { key: 'appointments', path: '/appointments', nameAr: 'إدارة المواعيد والعيادات الخارجية', nameEn: 'Appointments', descriptionAr: 'حجز المواعيد وتدفق غرف الكشف' },
  { key: 'admissions', path: '/admissions', nameAr: 'التنويم وخريطة الأسرّة', nameEn: 'Inpatients & Beds', descriptionAr: 'إدارة الغرف والأسرّة وتسكين المرضى والعمليات' },
  { key: 'medical_records', path: '/medical-records', nameAr: 'السجلات الطبية السريرية (EMR)', nameEn: 'Medical Records', descriptionAr: 'فحوصات SOAP والتشخيصات ICD-10' },
  { key: 'laboratory', path: '/laboratory', nameAr: 'المختبر المركزي والتحاليل (LIS)', nameEn: 'Laboratory', descriptionAr: 'طلبات التحاليل والنتائج المعملية' },
  { key: 'radiology', path: '/radiology', nameAr: 'قسم الأشعة والتصوير الطبي (RIS)', nameEn: 'Radiology', descriptionAr: 'فحوصات الرنين والأشعة المقطعية والسينية' },
  { key: 'pharmacy', path: '/pharmacy', nameAr: 'الصيدلية والمخزون الدوائي', nameEn: 'Pharmacy', descriptionAr: 'صرف الروشتات ومتابعة أرصدة الأدوية وحد الطلب' },
  { key: 'billing', path: '/billing', nameAr: 'الفوترة والمحاسبة الطبية', nameEn: 'Billing & Invoices', descriptionAr: 'إصدار الفواتير وتحصيل المدفوعات' },
  { key: 'insurance', path: '/insurance', nameAr: 'التأمين الطبي والمطالبات', nameEn: 'Insurance & Claims', descriptionAr: 'متابعة شركات التأمين والمطالبات والنسب' },
  { key: 'archive', path: '/archive', nameAr: 'الأرشيف الطبي وإدارة الوثائق (DMS)', nameEn: 'Archive & Documents', descriptionAr: 'أرشفة وتأمين المستندات والإقرارات الطبية' },
  { key: 'hr', path: '/hr', nameAr: 'الأطقم الطبية وشؤون الموظفين (HR)', nameEn: 'Staff & HR', descriptionAr: 'سجلات الأطباء والتمريض والمناوبات' },
  { key: 'reports', path: '/reports', nameAr: 'التقارير والمؤشرات الشاملة (MIS)', nameEn: 'MIS Reports', descriptionAr: 'التقارير المالية والطبية الشاملة واستخراج البيانات' },
  { key: 'settings', path: '/settings', nameAr: 'إعدادات النظام والمستخدمين والربط السحابي', nameEn: 'System Settings', descriptionAr: 'إدارة هوية المنشأة، الأقسام، والمستخدمين والصلاحيات' },
];

/** Login request payload */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Login response from the API */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Change password request */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ============================================================
// Patient Types
// ============================================================

/** Patient gender */
export type Gender = 'MALE' | 'FEMALE';

/** Blood type */
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

/** Patient record */
export interface Patient {
  id: number;
  mrn: string;
  nationalId?: string;
  fullNameAr: string;
  fullNameEn?: string;
  dateOfBirth?: string;
  gender: Gender;
  bloodType?: string;
  allergies?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  address?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  photoUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Create/Update patient payload */
export interface PatientFormData {
  fullNameAr: string;
  fullNameEn?: string;
  nationalId?: string;
  dateOfBirth?: string;
  gender: Gender;
  bloodType?: string;
  allergies?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  address?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}

// ============================================================
// Department, Room, Bed Types
// ============================================================

/** Hospital department */
export interface Department {
  id: number;
  nameAr: string;
  nameEn: string;
  type: string;
  description?: string;
  isActive: boolean;
  rooms?: Room[];
}

/** Room types */
export type RoomType = 'WARD' | 'PRIVATE' | 'SEMI_PRIVATE' | 'ICU' | 'OPERATING' | 'EMERGENCY' | 'EXAMINATION';

/** Room in a department */
export interface Room {
  id: number;
  roomNumber: string;
  departmentId: number;
  roomType: string;
  floor: number;
  beds?: Bed[];
  isActive: boolean;
}

/** Bed status */
export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

/** Bed in a room */
export interface Bed {
  id: number;
  bedNumber: string;
  roomId: number;
  status: BedStatus;
  room?: Room;
  patient?: Patient;
}

// ============================================================
// Employee & Doctor Types
// ============================================================

/** Hospital employee */
export interface Employee {
  id: number;
  fullNameAr: string;
  fullNameEn?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  position: string;
  departmentId?: number;
  departmentName?: string;
  hireDate?: string;
  salary?: number;
  isActive: boolean;
}

/** Doctor (extends employee) */
export interface Doctor {
  id: number;
  employeeId: number;
  employee?: Employee;
  specialty: string;
  licenseNumber?: string;
  departmentId?: number;
  department?: Department;
  consultationFee?: number;
}

// ============================================================
// Appointment Types
// ============================================================

/** Appointment status */
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

/** Visit type */
export type VisitType = 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'PROCEDURE';

/** Appointment record */
export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  scheduledAt: string;
  endAt?: string;
  status: AppointmentStatus;
  type: VisitType;
  notes?: string;
  cancelReason?: string;
}

/** Appointment form data */
export interface AppointmentFormData {
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  endAt?: string;
  type: VisitType;
  notes?: string;
}

// ============================================================
// Admission & Vital Signs Types
// ============================================================

/** Admission status */
export type AdmissionStatus = 'ADMITTED' | 'DISCHARGED' | 'TRANSFERRED' | 'DECEASED';

/** Patient admission */
export interface Admission {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  bedId?: number;
  bed?: Bed;
  admittedAt: string;
  dischargedAt?: string;
  status: string;
  admissionReason?: string;
  dischargeSummary?: string;
}

/** Admission form data */
export interface AdmissionFormData {
  patientId: number;
  doctorId: number;
  bedId?: number;
  admissionReason?: string;
}

/** Vital signs record */
export interface VitalSign {
  id: number;
  patientId: number;
  admissionId?: number;
  temperature?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  notes?: string;
  recordedAt: string;
  recordedBy?: string;
}

/** Vital signs form data */
export interface VitalSignFormData {
  patientId: number;
  admissionId?: number;
  temperature?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

// ============================================================
// Medical Record Types
// ============================================================

/** Medical record (SOAP format) */
export interface MedicalRecord {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  visitType: string;
  icd10Code?: string;
  icd10Desc?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
  createdAt: string;
}

/** Medical record form data */
export interface MedicalRecordFormData {
  patientId: number;
  doctorId: number;
  visitType: string;
  icd10Code?: string;
  icd10Desc?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
}

// ============================================================
// Laboratory Types
// ============================================================

/** Lab test definition */
export interface LabTest {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  category: string;
  normalRange?: string;
  unit?: string;
  price: number;
  isActive: boolean;
}

/** Lab order status */
export type LabOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/** Lab order priority */
export type Priority = 'ROUTINE' | 'URGENT' | 'STAT';

/** Lab order */
export interface LabOrder {
  id: number;
  orderNumber: string;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  status: string;
  priority: string;
  notes?: string;
  results?: LabResult[];
  createdAt: string;
}

/** Lab result */
export interface LabResult {
  id: number;
  orderId: number;
  testId: number;
  test?: LabTest;
  resultValue?: string;
  isAbnormal: boolean;
  notes?: string;
  performedBy?: string;
  resultAt?: string;
}

/** Lab order form data */
export interface LabOrderFormData {
  patientId: number;
  doctorId: number;
  testIds: number[];
  priority: string;
  notes?: string;
}

// ============================================================
// Radiology Types
// ============================================================

/** Radiology type/modality definition */
export interface RadiologyType {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
}

/** Radiology order */
export interface RadiologyOrder {
  id: number;
  orderNumber: string;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  typeId: number;
  type?: RadiologyType;
  status: string;
  priority: string;
  clinicalInfo?: string;
  report?: string;
  images?: RadiologyImage[];
  createdAt: string;
}

/** Radiology image */
export interface RadiologyImage {
  id: number;
  orderId: number;
  filePath: string;
  fileName: string;
}

/** Radiology order form data */
export interface RadiologyOrderFormData {
  patientId: number;
  doctorId: number;
  typeId: number;
  priority: string;
  clinicalInfo?: string;
}

// ============================================================
// Pharmacy Types
// ============================================================

/** Medication */
export interface Medication {
  id: number;
  code: string;
  tradeName: string;
  genericName: string;
  form: string;
  strength?: string;
  manufacturer?: string;
  category?: string;
  price: number;
  currentStock: number;
  minimumStock: number;
  expiryDate?: string;
  isControlled: boolean;
  isActive: boolean;
}

/** Medication form data */
export interface MedicationFormData {
  code: string;
  tradeName: string;
  genericName: string;
  form: string;
  strength?: string;
  manufacturer?: string;
  category?: string;
  price: number;
  currentStock: number;
  minimumStock: number;
  expiryDate?: string;
  isControlled: boolean;
}

/** Prescription */
export interface Prescription {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  status: string;
  notes?: string;
  items?: PrescriptionItem[];
  createdAt: string;
}

/** Prescription item */
export interface PrescriptionItem {
  id: number;
  prescriptionId: number;
  medicationId: number;
  medication?: Medication;
  dosage: string;
  frequency: string;
  duration?: string;
  quantity: number;
  dispensed: boolean;
}

/** Stock movement */
export interface StockMovement {
  id: number;
  medicationId: number;
  medication?: Medication;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  reference?: string;
  createdAt: string;
  createdBy?: string;
}

// ============================================================
// Billing Types
// ============================================================

/** Invoice status */
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED' | 'REFUNDED';

/** Invoice */
export interface Invoice {
  id: number;
  invoiceNumber: string;
  patientId: number;
  patient?: Patient;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  status: string;
  paymentMethod?: string;
  notes?: string;
  items?: InvoiceItem[];
  payments?: Payment[];
  createdAt: string;
}

/** Invoice item */
export interface InvoiceItem {
  id: number;
  invoiceId: number;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** Payment record */
export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  reference?: string;
  paidAt: string;
}

/** Invoice form data */
export interface InvoiceFormData {
  patientId: number;
  items: Omit<InvoiceItem, 'id' | 'invoiceId'>[];
  discount?: number;
  tax?: number;
  notes?: string;
}

// ============================================================
// Insurance Types
// ============================================================

/** Insurance company */
export interface InsuranceCompany {
  id: number;
  nameAr: string;
  nameEn?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  discountRate?: number;
  isActive: boolean;
}

/** Insurance card */
export interface InsuranceCard {
  id: number;
  patientId: number;
  companyId: number;
  company?: InsuranceCompany;
  cardNumber: string;
  policyType?: string;
  coveragePercent?: number;
  maxCoverage?: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
}

/** Insurance claim */
export interface InsuranceClaim {
  id: number;
  claimNumber: string;
  invoiceId: number;
  companyId: number;
  company?: InsuranceCompany;
  claimedAmount: number;
  approvedAmount?: number;
  status: string;
  submittedAt: string;
}

// ============================================================
// Archive Types
// ============================================================

/** Archive document */
export interface Archive {
  id: number;
  patientId?: number;
  patient?: Patient;
  title: string;
  description?: string;
  category: string;
  fileType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedBy: number;
  tags?: string;
  createdAt: string;
}

/** Archive form data */
export interface ArchiveFormData {
  patientId?: number;
  title: string;
  description?: string;
  category: string;
  tags?: string;
}

// ============================================================
// HR Types
// ============================================================

/** Employee form data */
export interface EmployeeFormData {
  fullNameAr: string;
  fullNameEn?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  position: string;
  departmentId?: number;
  hireDate?: string;
  salary?: number;
}

/** Shift schedule */
export interface Shift {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  shiftType: 'MORNING' | 'EVENING' | 'NIGHT';
  startTime: string;
  endTime: string;
  notes?: string;
}

/** Attendance record */
export interface Attendance {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  notes?: string;
}

// ============================================================
// Dashboard Types
// ============================================================

/** Dashboard statistics */
export interface DashboardStats {
  todayPatients: number;
  totalPatients: number;
  todayAppointments: number;
  currentAdmissions: number;
  bedOccupancyRate: number;
  todayRevenue: number;
  monthRevenue: number;
  pendingLabOrders: number;
  lowStockMedications: number;
  pendingClaims: number;
}

/** Dashboard chart data point */
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// ============================================================
// Common/Shared Types
// ============================================================

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** API error response */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/** Common query parameters */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

/** Timeline event (for patient timeline) */
export interface TimelineEvent {
  id: number;
  type: 'appointment' | 'admission' | 'lab' | 'radiology' | 'prescription' | 'record' | 'billing';
  title: string;
  description?: string;
  date: string;
  icon?: string;
  color?: string;
}

/** Notification */
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
}

/** Hospital settings */
export interface HospitalSettings {
  id: number;
  name: string;
  nameEn?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  taxRate?: number;
  currency: string;
}
