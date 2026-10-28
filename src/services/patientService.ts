/**
 * Hospital MIS - Patient Service
 * CRUD operations and patient timeline for the Patients module.
 */
import api from './api';
import type { Patient, PatientFormData, PaginatedResponse, QueryParams, TimelineEvent } from '../types';

const patientService = {
  /** Get paginated list of patients with optional search/filter */
  getPatients: async (params?: QueryParams): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get<PaginatedResponse<Patient>>('/patients', { params });
    return response.data;
  },

  /** Get a single patient by ID */
  getPatient: async (id: number): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  /** Create a new patient record */
  createPatient: async (data: PatientFormData): Promise<Patient> => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },

  /** Update an existing patient record */
  updatePatient: async (id: number, data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  /** Delete (deactivate) a patient */
  deletePatient: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  /** Get a chronological timeline of all events for a patient */
  getPatientTimeline: async (id: number): Promise<TimelineEvent[]> => {
    const response = await api.get<TimelineEvent[]>(`/patients/${id}/timeline`);
    return response.data;
  },
};

export default patientService;
