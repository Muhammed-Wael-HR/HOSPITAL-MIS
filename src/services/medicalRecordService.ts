/**
 * Hospital MIS - Medical Record Service
 * Manages SOAP-format medical records and ICD-10 code lookups.
 */
import api from './api';
import type { MedicalRecord, MedicalRecordFormData, PaginatedResponse, QueryParams } from '../types';

const medicalRecordService = {
  /** Get paginated list of medical records */
  getRecords: async (params?: QueryParams): Promise<PaginatedResponse<MedicalRecord>> => {
    const response = await api.get<PaginatedResponse<MedicalRecord>>('/medical-records', { params });
    return response.data;
  },

  /** Get a single medical record by ID */
  getRecord: async (id: number): Promise<MedicalRecord> => {
    const response = await api.get<MedicalRecord>(`/medical-records/${id}`);
    return response.data;
  },

  /** Create a new medical record */
  createRecord: async (data: MedicalRecordFormData): Promise<MedicalRecord> => {
    const response = await api.post<MedicalRecord>('/medical-records', data);
    return response.data;
  },

  /** Update an existing medical record */
  updateRecord: async (id: number, data: Partial<MedicalRecordFormData>): Promise<MedicalRecord> => {
    const response = await api.put<MedicalRecord>(`/medical-records/${id}`, data);
    return response.data;
  },

  /** Get records for a specific patient */
  getPatientRecords: async (patientId: number): Promise<MedicalRecord[]> => {
    const response = await api.get<MedicalRecord[]>(`/medical-records/patient/${patientId}`);
    return response.data;
  },

  /** Search ICD-10 codes */
  searchICD10: async (query: string): Promise<{ code: string; description: string }[]> => {
    const response = await api.get('/medical-records/icd10', { params: { q: query } });
    return response.data;
  },
};

export default medicalRecordService;
