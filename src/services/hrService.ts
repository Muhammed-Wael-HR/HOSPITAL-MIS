/**
 * Hospital MIS - HR Service
 * Manages employees, shifts, and attendance records.
 */
import api from './api';
import type { Employee, EmployeeFormData, Shift, Attendance, PaginatedResponse, QueryParams } from '../types';

const hrService = {
  // ---- Employees ----

  /** Get paginated list of employees */
  getEmployees: async (params?: QueryParams): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get<PaginatedResponse<Employee>>('/hr/employees', { params });
    return response.data;
  },

  /** Get a single employee by ID */
  getEmployee: async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/hr/employees/${id}`);
    return response.data;
  },

  /** Create a new employee */
  createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
    const response = await api.post<Employee>('/hr/employees', data);
    return response.data;
  },

  /** Update an employee */
  updateEmployee: async (id: number, data: Partial<EmployeeFormData>): Promise<Employee> => {
    const response = await api.put<Employee>(`/hr/employees/${id}`, data);
    return response.data;
  },

  /** Delete (deactivate) an employee */
  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/hr/employees/${id}`);
  },

  // ---- Shifts ----

  /** Get shifts for a date range */
  getShifts: async (params?: { start?: string; end?: string; employeeId?: number }): Promise<Shift[]> => {
    const response = await api.get<Shift[]>('/hr/shifts', { params });
    return response.data;
  },

  /** Create a shift */
  createShift: async (data: Partial<Shift>): Promise<Shift> => {
    const response = await api.post<Shift>('/hr/shifts', data);
    return response.data;
  },

  /** Update a shift */
  updateShift: async (id: number, data: Partial<Shift>): Promise<Shift> => {
    const response = await api.put<Shift>(`/hr/shifts/${id}`, data);
    return response.data;
  },

  /** Delete a shift */
  deleteShift: async (id: number): Promise<void> => {
    await api.delete(`/hr/shifts/${id}`);
  },

  // ---- Attendance ----

  /** Get attendance records */
  getAttendance: async (params?: QueryParams): Promise<PaginatedResponse<Attendance>> => {
    const response = await api.get<PaginatedResponse<Attendance>>('/hr/attendance', { params });
    return response.data;
  },

  /** Record attendance (check-in/check-out) */
  recordAttendance: async (data: Partial<Attendance>): Promise<Attendance> => {
    const response = await api.post<Attendance>('/hr/attendance', data);
    return response.data;
  },

  /** Update attendance record */
  updateAttendance: async (id: number, data: Partial<Attendance>): Promise<Attendance> => {
    const response = await api.put<Attendance>(`/hr/attendance/${id}`, data);
    return response.data;
  },
};

export default hrService;
