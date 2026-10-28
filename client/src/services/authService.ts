/**
 * Hospital MIS - Authentication Service
 * Handles login, token refresh, and user profile operations.
 */
import api from './api';
import type { LoginRequest, LoginResponse, User, ChangePasswordRequest } from '../types';

const authService = {
  /** Authenticate user with username and password */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /** Refresh the access token using the refresh token */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /** Get current authenticated user profile */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /** Change the current user's password */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data);
  },
};

export default authService;
