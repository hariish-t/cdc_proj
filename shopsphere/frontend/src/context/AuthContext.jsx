import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { authService } from '../services/auth';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        try {
          // Verify token with backend
          const response = await authAPI.verifyToken();
          
          // Since your axios interceptor returns response.data, 
          // we check response.data (for double nesting) or response directly
          const userData = response?.data?.user || response?.user || savedUser;
          
          setUser(userData);
          setIsAuthenticated(true);
          socketService.connect(token);
        } catch (error) {
          console.error('Session restoration failed:', error);
          authService.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // FIX: Your Axios interceptor returns response.data. 
      // If your backend wraps it in another 'data' object, we handle both.
      const resData = response?.data || response;

      if (resData.accessToken || resData.token) {
        const accessToken = resData.accessToken || resData.token;
        const refreshToken = resData.refreshToken;
        const loggedUser = resData.user;

        // 1. Save to LocalStorage FIRST (synchronously)
        authService.setTokens(accessToken, refreshToken);
        authService.setUser(loggedUser);

        // 2. Update React State
        setUser(loggedUser);
        setIsAuthenticated(true);
        
        // 3. Connect socket
        socketService.connect(accessToken);
        
        toast.success(`Welcome back, ${loggedUser.name || 'Admin'}!`);
        return true; 
      }
      
      toast.error("Login failed: Invalid response format");
      return false;
    } catch (error) {
      // Extract error message from the response your interceptor threw
      const errorMsg = error?.error?.message || error?.message || "Invalid credentials";
      console.error("Login Error:", errorMsg);
      toast.error(errorMsg);
      return false;
    }
  };

  /**
   * Register function
   */
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const resData = response?.data || response;

      const { user: newUser, accessToken, refreshToken } = resData;

      authService.setTokens(accessToken, refreshToken);
      authService.setUser(newUser);

      setUser(newUser);
      setIsAuthenticated(true);
      socketService.connect(accessToken);

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error?.error?.message || error?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      authService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      socketService.disconnect();
      toast.success('Logged out successfully');
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = async (updateData) => {
    try {
      const response = await authAPI.updateProfile(updateData);
      const updatedUser = response?.data || response;

      authService.setUser(updatedUser);
      setUser(updatedUser);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error?.error?.message || error?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const hasRole = (role) => user?.role === role;
  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
