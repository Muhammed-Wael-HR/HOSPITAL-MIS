/**
 * Hospital MIS - Archive Service
 * Manages document uploads, viewing, and access logging.
 */
import api from './api';
import type { Archive, ArchiveFormData, PaginatedResponse, QueryParams } from '../types';

const archiveService = {
  /** Get paginated list of archived documents */
  getDocuments: async (params?: QueryParams): Promise<PaginatedResponse<Archive>> => {
    const response = await api.get<PaginatedResponse<Archive>>('/archive', { params });
    return response.data;
  },

  /** Get a single document by ID */
  getDocument: async (id: number): Promise<Archive> => {
    const response = await api.get<Archive>(`/archive/${id}`);
    return response.data;
  },

  /** Upload a new document */
  uploadDocument: async (file: File, metadata: ArchiveFormData): Promise<Archive> => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    const response = await api.post<Archive>('/archive', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Update document metadata */
  updateDocument: async (id: number, data: Partial<ArchiveFormData>): Promise<Archive> => {
    const response = await api.put<Archive>(`/archive/${id}`, data);
    return response.data;
  },

  /** Delete a document */
  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/archive/${id}`);
  },

  /** Download a document */
  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await api.get(`/archive/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  /** Get patient documents */
  getPatientDocuments: async (patientId: number): Promise<Archive[]> => {
    const response = await api.get<Archive[]>(`/archive/patient/${patientId}`);
    return response.data;
  },
};

export default archiveService;
