/**
 * Hospital MIS - Insurance Service
 * Manages insurance companies, patient cards, and claims.
 */
import api from './api';
import type { InsuranceCompany, InsuranceCard, InsuranceClaim, PaginatedResponse, QueryParams } from '../types';

const insuranceService = {
  // ---- Insurance Companies ----

  /** Get all insurance companies */
  getCompanies: async (params?: QueryParams): Promise<PaginatedResponse<InsuranceCompany>> => {
    const response = await api.get<PaginatedResponse<InsuranceCompany>>('/insurance/companies', { params });
    return response.data;
  },

  /** Get a single company by ID */
  getCompany: async (id: number): Promise<InsuranceCompany> => {
    const response = await api.get<InsuranceCompany>(`/insurance/companies/${id}`);
    return response.data;
  },

  /** Create a new insurance company */
  createCompany: async (data: Partial<InsuranceCompany>): Promise<InsuranceCompany> => {
    const response = await api.post<InsuranceCompany>('/insurance/companies', data);
    return response.data;
  },

  /** Update an insurance company */
  updateCompany: async (id: number, data: Partial<InsuranceCompany>): Promise<InsuranceCompany> => {
    const response = await api.put<InsuranceCompany>(`/insurance/companies/${id}`, data);
    return response.data;
  },

  // ---- Insurance Cards ----

  /** Get patient insurance cards */
  getPatientCards: async (patientId: number): Promise<InsuranceCard[]> => {
    const response = await api.get<InsuranceCard[]>(`/insurance/cards/patient/${patientId}`);
    return response.data;
  },

  /** Create a new insurance card */
  createCard: async (data: Partial<InsuranceCard>): Promise<InsuranceCard> => {
    const response = await api.post<InsuranceCard>('/insurance/cards', data);
    return response.data;
  },

  /** Update an insurance card */
  updateCard: async (id: number, data: Partial<InsuranceCard>): Promise<InsuranceCard> => {
    const response = await api.put<InsuranceCard>(`/insurance/cards/${id}`, data);
    return response.data;
  },

  // ---- Insurance Claims ----

  /** Get paginated list of claims */
  getClaims: async (params?: QueryParams): Promise<PaginatedResponse<InsuranceClaim>> => {
    const response = await api.get<PaginatedResponse<InsuranceClaim>>('/insurance/claims', { params });
    return response.data;
  },

  /** Create a new claim */
  createClaim: async (data: Partial<InsuranceClaim>): Promise<InsuranceClaim> => {
    const response = await api.post<InsuranceClaim>('/insurance/claims', data);
    return response.data;
  },

  /** Update claim status */
  updateClaimStatus: async (id: number, status: string, approvedAmount?: number): Promise<InsuranceClaim> => {
    const response = await api.patch<InsuranceClaim>(`/insurance/claims/${id}/status`, { status, approvedAmount });
    return response.data;
  },
};

export default insuranceService;
