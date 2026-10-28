/**
 * Hospital MIS - Laboratory Service
 * Manages lab tests catalog, orders, and result entry.
 */
import api from './api';
import type { LabTest, LabOrder, LabResult, LabOrderFormData, PaginatedResponse, QueryParams } from '../types';

const labService = {
  // ---- Lab Tests (Catalog) ----

  /** Get all available lab tests */
  getTests: async (params?: QueryParams): Promise<PaginatedResponse<LabTest>> => {
    const response = await api.get<PaginatedResponse<LabTest>>('/laboratory/tests', { params });
    return response.data;
  },

  /** Create a new lab test definition */
  createTest: async (data: Partial<LabTest>): Promise<LabTest> => {
    const response = await api.post<LabTest>('/laboratory/tests', data);
    return response.data;
  },

  /** Update a lab test definition */
  updateTest: async (id: number, data: Partial<LabTest>): Promise<LabTest> => {
    const response = await api.put<LabTest>(`/laboratory/tests/${id}`, data);
    return response.data;
  },

  // ---- Lab Orders ----

  /** Get paginated list of lab orders */
  getOrders: async (params?: QueryParams): Promise<PaginatedResponse<LabOrder>> => {
    const response = await api.get<PaginatedResponse<LabOrder>>('/laboratory/orders', { params });
    return response.data;
  },

  /** Get a single lab order by ID */
  getOrder: async (id: number): Promise<LabOrder> => {
    const response = await api.get<LabOrder>(`/laboratory/orders/${id}`);
    return response.data;
  },

  /** Create a new lab order */
  createOrder: async (data: LabOrderFormData): Promise<LabOrder> => {
    const response = await api.post<LabOrder>('/laboratory/orders', data);
    return response.data;
  },

  /** Cancel a lab order */
  cancelOrder: async (id: number): Promise<void> => {
    await api.patch(`/laboratory/orders/${id}/cancel`);
  },

  // ---- Lab Results ----

  /** Submit results for a lab order */
  submitResults: async (orderId: number, results: Partial<LabResult>[]): Promise<LabResult[]> => {
    const response = await api.post<LabResult[]>(`/laboratory/orders/${orderId}/results`, { results });
    return response.data;
  },

  /** Approve results for a lab order */
  approveResults: async (orderId: number): Promise<void> => {
    await api.patch(`/laboratory/orders/${orderId}/approve`);
  },

  /** Get patient lab orders */
  getPatientOrders: async (patientId: number): Promise<LabOrder[]> => {
    const response = await api.get<LabOrder[]>(`/laboratory/patient/${patientId}`);
    return response.data;
  },
};

export default labService;
