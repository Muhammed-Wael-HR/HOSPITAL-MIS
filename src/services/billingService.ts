/**
 * Hospital MIS - Billing Service
 * Manages invoices, payments, and financial operations.
 */
import api from './api';
import type { Invoice, InvoiceFormData, Payment, PaginatedResponse, QueryParams } from '../types';

const billingService = {
  // ---- Invoices ----

  /** Get paginated list of invoices */
  getInvoices: async (params?: QueryParams): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get<PaginatedResponse<Invoice>>('/billing/invoices', { params });
    return response.data;
  },

  /** Get a single invoice by ID */
  getInvoice: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/billing/invoices/${id}`);
    return response.data;
  },

  /** Create a new invoice */
  createInvoice: async (data: InvoiceFormData): Promise<Invoice> => {
    const response = await api.post<Invoice>('/billing/invoices', data);
    return response.data;
  },

  /** Update an invoice */
  updateInvoice: async (id: number, data: Partial<InvoiceFormData>): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/billing/invoices/${id}`, data);
    return response.data;
  },

  /** Cancel an invoice */
  cancelInvoice: async (id: number): Promise<void> => {
    await api.patch(`/billing/invoices/${id}/cancel`);
  },

  // ---- Payments ----

  /** Record a payment for an invoice */
  recordPayment: async (invoiceId: number, data: { amount: number; method: string; reference?: string }): Promise<Payment> => {
    const response = await api.post<Payment>(`/billing/invoices/${invoiceId}/payments`, data);
    return response.data;
  },

  /** Get patient invoices */
  getPatientInvoices: async (patientId: number): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>(`/billing/patient/${patientId}`);
    return response.data;
  },

  /** Get daily revenue summary */
  getDailyRevenue: async (date?: string): Promise<{ total: number; count: number }> => {
    const response = await api.get('/billing/revenue/daily', { params: { date } });
    return response.data;
  },
};

export default billingService;
