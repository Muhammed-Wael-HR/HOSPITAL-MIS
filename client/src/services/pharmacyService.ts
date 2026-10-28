/**
 * Hospital MIS - Pharmacy Service
 * Manages medications inventory, prescriptions, dispensing, and stock movements.
 */
import api from './api';
import type {
  Medication, MedicationFormData, Prescription, StockMovement,
  PaginatedResponse, QueryParams
} from '../types';

const pharmacyService = {
  // ---- Medications ----

  /** Get paginated list of medications */
  getMedications: async (params?: QueryParams): Promise<PaginatedResponse<Medication>> => {
    const response = await api.get<PaginatedResponse<Medication>>('/pharmacy/medications', { params });
    return response.data;
  },

  /** Get a single medication by ID */
  getMedication: async (id: number): Promise<Medication> => {
    const response = await api.get<Medication>(`/pharmacy/medications/${id}`);
    return response.data;
  },

  /** Create a new medication */
  createMedication: async (data: MedicationFormData): Promise<Medication> => {
    const response = await api.post<Medication>('/pharmacy/medications', data);
    return response.data;
  },

  /** Update a medication */
  updateMedication: async (id: number, data: Partial<MedicationFormData>): Promise<Medication> => {
    const response = await api.put<Medication>(`/pharmacy/medications/${id}`, data);
    return response.data;
  },

  /** Delete a medication */
  deleteMedication: async (id: number): Promise<void> => {
    await api.delete(`/pharmacy/medications/${id}`);
  },

  /** Get medications with low stock */
  getLowStock: async (): Promise<Medication[]> => {
    const response = await api.get<Medication[]>('/pharmacy/medications/low-stock');
    return response.data;
  },

  // ---- Prescriptions ----

  /** Get paginated list of prescriptions */
  getPrescriptions: async (params?: QueryParams): Promise<PaginatedResponse<Prescription>> => {
    const response = await api.get<PaginatedResponse<Prescription>>('/pharmacy/prescriptions', { params });
    return response.data;
  },

  /** Get a single prescription by ID */
  getPrescription: async (id: number): Promise<Prescription> => {
    const response = await api.get<Prescription>(`/pharmacy/prescriptions/${id}`);
    return response.data;
  },

  /** Create a new prescription */
  createPrescription: async (data: Partial<Prescription>): Promise<Prescription> => {
    const response = await api.post<Prescription>('/pharmacy/prescriptions', data);
    return response.data;
  },

  /** Dispense prescription items */
  dispensePrescription: async (id: number, itemIds: number[]): Promise<Prescription> => {
    const response = await api.post<Prescription>(`/pharmacy/prescriptions/${id}/dispense`, { itemIds });
    return response.data;
  },

  /** Get patient prescriptions */
  getPatientPrescriptions: async (patientId: number): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(`/pharmacy/patient/${patientId}`);
    return response.data;
  },

  // ---- Stock Movements ----

  /** Get stock movements */
  getStockMovements: async (params?: QueryParams): Promise<PaginatedResponse<StockMovement>> => {
    const response = await api.get<PaginatedResponse<StockMovement>>('/pharmacy/stock-movements', { params });
    return response.data;
  },

  /** Create a stock movement */
  createStockMovement: async (data: Partial<StockMovement>): Promise<StockMovement> => {
    const response = await api.post<StockMovement>('/pharmacy/stock-movements', data);
    return response.data;
  },
};

export default pharmacyService;
