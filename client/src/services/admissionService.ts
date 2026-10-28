/**
 * Hospital MIS - Admission Service
 * Manages patient admissions, discharges, bed assignments, and vital signs.
 */
import api from './api';
import type {
  Admission, AdmissionFormData, Bed, VitalSign, VitalSignFormData,
  PaginatedResponse, QueryParams
} from '../types';

const admissionService = {
  /** Get paginated list of admissions */
  getAdmissions: async (params?: QueryParams): Promise<PaginatedResponse<Admission>> => {
    const response = await api.get<PaginatedResponse<Admission>>('/admissions', { params });
    return response.data;
  },

  /** Get a single admission by ID */
  getAdmission: async (id: number): Promise<Admission> => {
    const response = await api.get<Admission>(`/admissions/${id}`);
    return response.data;
  },

  /** Admit a patient */
  createAdmission: async (data: AdmissionFormData): Promise<Admission> => {
    const response = await api.post<Admission>('/admissions', data);
    return response.data;
  },

  /** Update an admission (e.g., change bed, update reason) */
  updateAdmission: async (id: number, data: Partial<AdmissionFormData>): Promise<Admission> => {
    const response = await api.put<Admission>(`/admissions/${id}`, data);
    return response.data;
  },

  /** Discharge a patient */
  dischargePatient: async (id: number, dischargeSummary?: string): Promise<Admission> => {
    const response = await api.post<Admission>(`/admissions/${id}/discharge`, { dischargeSummary });
    return response.data;
  },

  /** Get all beds with their current status */
  getBeds: async (params?: { departmentId?: number }): Promise<Bed[]> => {
    const response = await api.get<Bed[]>('/admissions/beds', { params });
    return response.data;
  },

  /** Record vital signs for a patient */
  recordVitalSigns: async (data: VitalSignFormData): Promise<VitalSign> => {
    const response = await api.post<VitalSign>('/admissions/vitals', data);
    return response.data;
  },

  /** Get vital signs history for a patient */
  getVitalSigns: async (patientId: number, params?: QueryParams): Promise<VitalSign[]> => {
    const response = await api.get<VitalSign[]>(`/admissions/vitals/${patientId}`, { params });
    return response.data;
  },
};

export default admissionService;
