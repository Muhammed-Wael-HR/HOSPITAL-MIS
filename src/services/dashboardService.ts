/**
 * Hospital MIS - Dashboard Service
 * Fetches dashboard statistics and chart data.
 */
import api from './api';
import type { DashboardStats, ChartDataPoint } from '../types';

const dashboardService = {
  /** Get dashboard statistics */
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard');
    return response.data;
  },

  /** Get appointment chart data */
  getAppointmentChart: async (days?: number): Promise<ChartDataPoint[]> => {
    const response = await api.get<ChartDataPoint[]>('/dashboard/charts/appointments', { params: { days } });
    return response.data;
  },

  /** Get revenue chart data */
  getRevenueChart: async (days?: number): Promise<ChartDataPoint[]> => {
    const response = await api.get<ChartDataPoint[]>('/dashboard/charts/revenue', { params: { days } });
    return response.data;
  },
};

export default dashboardService;
