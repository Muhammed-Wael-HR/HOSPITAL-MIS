/**
 * Hospital MIS - Settings Service
 * Manages hospital settings, departments, rooms, beds, and user accounts.
 */
import api from './api';
import type { HospitalSettings, Department, Room, Bed, User } from '../types';

const settingsService = {
  // ---- Hospital Settings ----

  /** Get hospital settings */
  getSettings: async (): Promise<HospitalSettings> => {
    const response = await api.get<HospitalSettings>('/settings');
    return response.data;
  },

  /** Update hospital settings */
  updateSettings: async (data: Partial<HospitalSettings>): Promise<HospitalSettings> => {
    const response = await api.put<HospitalSettings>('/settings', data);
    return response.data;
  },

  // ---- Departments ----

  /** Get all departments */
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>('/settings/departments');
    return response.data;
  },

  /** Create a department */
  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const response = await api.post<Department>('/settings/departments', data);
    return response.data;
  },

  /** Update a department */
  updateDepartment: async (id: number, data: Partial<Department>): Promise<Department> => {
    const response = await api.put<Department>(`/settings/departments/${id}`, data);
    return response.data;
  },

  /** Delete a department */
  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/settings/departments/${id}`);
  },

  // ---- Rooms ----

  /** Get rooms (optionally filtered by department) */
  getRooms: async (departmentId?: number): Promise<Room[]> => {
    const response = await api.get<Room[]>('/settings/rooms', { params: { departmentId } });
    return response.data;
  },

  /** Create a room */
  createRoom: async (data: Partial<Room>): Promise<Room> => {
    const response = await api.post<Room>('/settings/rooms', data);
    return response.data;
  },

  /** Update a room */
  updateRoom: async (id: number, data: Partial<Room>): Promise<Room> => {
    const response = await api.put<Room>(`/settings/rooms/${id}`, data);
    return response.data;
  },

  /** Delete a room */
  deleteRoom: async (id: number): Promise<void> => {
    await api.delete(`/settings/rooms/${id}`);
  },

  // ---- Beds ----

  /** Create a bed */
  createBed: async (data: Partial<Bed>): Promise<Bed> => {
    const response = await api.post<Bed>('/settings/beds', data);
    return response.data;
  },

  /** Update a bed */
  updateBed: async (id: number, data: Partial<Bed>): Promise<Bed> => {
    const response = await api.put<Bed>(`/settings/beds/${id}`, data);
    return response.data;
  },

  /** Delete a bed */
  deleteBed: async (id: number): Promise<void> => {
    await api.delete(`/settings/beds/${id}`);
  },

  // ---- Users ----

  /** Get all users */
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/settings/users');
    return response.data;
  },

  /** Create a user */
  createUser: async (data: { username: string; password: string; role: string; employeeId?: number }): Promise<User> => {
    const response = await api.post<User>('/settings/users', data);
    return response.data;
  },

  /** Update a user */
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/settings/users/${id}`, data);
    return response.data;
  },

  /** Toggle user active status */
  toggleUserActive: async (id: number): Promise<User> => {
    const response = await api.patch<User>(`/settings/users/${id}/toggle-active`);
    return response.data;
  },

  // ---- Backup ----

  /** Create a database backup */
  createBackup: async (): Promise<{ url: string; fileName: string }> => {
    const response = await api.post('/settings/backup');
    return response.data;
  },

  /** Restore from a backup file */
  restoreBackup: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('backup', file);
    await api.post('/settings/restore', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default settingsService;
