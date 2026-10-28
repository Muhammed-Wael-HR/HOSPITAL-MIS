/**
 * Hospital MIS - Radiology Service
 * Manages radiology types, orders, reports, and image uploads.
 */
import api from './api';
import type { RadiologyType, RadiologyOrder, RadiologyOrderFormData, PaginatedResponse, QueryParams } from '../types';

const radiologyService = {
  // ---- Radiology Types (Catalog) ----

  /** Get all radiology types/modalities */
  getTypes: async (): Promise<RadiologyType[]> => {
    const response = await api.get<RadiologyType[]>('/radiology/types');
    return response.data;
  },

  /** Create a new radiology type */
  createType: async (data: Partial<RadiologyType>): Promise<RadiologyType> => {
    const response = await api.post<RadiologyType>('/radiology/types', data);
    return response.data;
  },

  // ---- Radiology Orders ----

  /** Get paginated list of radiology orders */
  getOrders: async (params?: QueryParams): Promise<PaginatedResponse<RadiologyOrder>> => {
    const response = await api.get<PaginatedResponse<RadiologyOrder>>('/radiology/orders', { params });
    return response.data;
  },

  /** Get a single radiology order by ID */
  getOrder: async (id: number): Promise<RadiologyOrder> => {
    const response = await api.get<RadiologyOrder>(`/radiology/orders/${id}`);
    return response.data;
  },

  /** Create a new radiology order */
  createOrder: async (data: RadiologyOrderFormData): Promise<RadiologyOrder> => {
    const response = await api.post<RadiologyOrder>('/radiology/orders', data);
    return response.data;
  },

  /** Update order status */
  updateOrderStatus: async (id: number, status: string): Promise<RadiologyOrder> => {
    const response = await api.patch<RadiologyOrder>(`/radiology/orders/${id}/status`, { status });
    return response.data;
  },

  /** Submit radiology report */
  submitReport: async (id: number, report: string): Promise<RadiologyOrder> => {
    const response = await api.post<RadiologyOrder>(`/radiology/orders/${id}/report`, { report });
    return response.data;
  },

  /** Upload images for a radiology order */
  uploadImages: async (id: number, files: FormData): Promise<void> => {
    await api.post(`/radiology/orders/${id}/images`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** Get patient radiology orders */
  getPatientOrders: async (patientId: number): Promise<RadiologyOrder[]> => {
    const response = await api.get<RadiologyOrder[]>(`/radiology/patient/${patientId}`);
    return response.data;
  },
};

export default radiologyService;
