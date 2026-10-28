/**
 * Hospital MIS - Report Service
 * Generates various hospital reports (patient, revenue, occupancy, etc.).
 */
import api from './api';

/** Report query parameters */
export interface ReportParams {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  doctorId?: number;
  format?: 'json' | 'pdf' | 'excel';
}

const reportService = {
  /** Get patient statistics report */
  getPatientReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/patients', { params });
    return response.data;
  },

  /** Get revenue report */
  getRevenueReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/revenue', { params });
    return response.data;
  },

  /** Get bed occupancy report */
  getOccupancyReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/occupancy', { params });
    return response.data;
  },

  /** Get doctor performance report */
  getDoctorPerformanceReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/doctor-performance', { params });
    return response.data;
  },

  /** Get inventory / medication stock report */
  getInventoryReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },

  /** Get laboratory report */
  getLabReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/lab', { params });
    return response.data;
  },

  /** Export a report as PDF */
  exportPdf: async (reportType: string, params?: ReportParams): Promise<Blob> => {
    const response = await api.get(`/reports/${reportType}/export/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /** Export a report as Excel */
  exportExcel: async (reportType: string, params?: ReportParams): Promise<Blob> => {
    const response = await api.get(`/reports/${reportType}/export/excel`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService;
