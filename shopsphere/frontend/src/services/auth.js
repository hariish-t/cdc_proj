/**
 * Authentication Service
 * Handles token management and auth state
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const authService = {
  /**
   * Save tokens to localStorage
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  /**
   * Get access token
   */
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Save user data
   */
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get user data
   */
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Clear all auth data
   */
  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  },

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    const user = this.getUser();
    return user?.role === role;
  },

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.hasRole('admin');
  },

  /**
   * Decode JWT token (simple decode, not verification)
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  },

  /**
   * Get token expiry time
   */
  getTokenExpiry() {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  },
};

export default authService;
