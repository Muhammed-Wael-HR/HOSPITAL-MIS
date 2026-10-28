/**
 * Hospital MIS - Appointment Service
 * Handles scheduling, calendar views, and appointment status management.
 */
import api from './api';
import type { Appointment, AppointmentFormData, PaginatedResponse, QueryParams } from '../types';

const appointmentService = {
  /** Get paginated list of appointments with filters */
  getAppointments: async (params?: QueryParams): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/appointments', { params });
    return response.data;
  },

  /** Get a single appointment by ID */
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  /** Create a new appointment */
  createAppointment: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  },

  /** Update an appointment */
  updateAppointment: async (id: number, data: Partial<AppointmentFormData>): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  /** Update appointment status (e.g., mark as completed, cancelled) */
  updateAppointmentStatus: async (id: number, status: string, cancelReason?: string): Promise<Appointment> => {
    const response = await api.patch<Appointment>(`/appointments/${id}/status`, { status, cancelReason });
    return response.data;
  },

  /** Get calendar view data for appointments */
  getCalendar: async (params?: { start?: string; end?: string; doctorId?: number }): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments/calendar', { params });
    return response.data;
  },

  /** Get today's appointments */
  getTodayAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments/today');
    return response.data;
  },
};

export default appointmentService;
