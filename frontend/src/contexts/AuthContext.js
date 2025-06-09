import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Auth-specific routes
const AUTH_ROUTES = {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    checkAuth: `${API_BASE_URL}/api/auth/check-auth`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    changePassword: `${API_BASE_URL}/api/auth/change-password`
};

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Set up axios defaults
        axios.defaults.baseURL = API_BASE_URL;
        axios.defaults.withCredentials = true;

        // Add request interceptor to add auth token
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                // Only modify URLs that don't already include the base URL
                if (!config.url.startsWith('http') && !config.url.startsWith(API_BASE_URL)) {
                    config.url = `${API_BASE_URL}/${config.url}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle 401 errors
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Clear user data and token
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                }
                return Promise.reject(error);
            }
        );

        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(AUTH_ROUTES.checkAuth);
            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(AUTH_ROUTES.login, { email, password });
            if (response.data.success) {
                const { userToken, user } = response.data;
                localStorage.setItem('token', userToken);
                setUser(user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, error: response.data.message || 'Login failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post(AUTH_ROUTES.register, userData);
            if (response.data.success) {
                const { userToken, user } = response.data;
                localStorage.setItem('token', userToken);
                setUser(user);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, error: response.data.message || 'Registration failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await axios.post(AUTH_ROUTES.logout);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setError(null);
            const response = await axios.put(AUTH_ROUTES.profile, profileData);
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: response.data.message || 'Profile update failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            const response = await axios.put(AUTH_ROUTES.changePassword, {
                currentPassword,
                newPassword
            });
            if (response.data.success) {
                return { success: true };
            }
            return { success: false, error: response.data.message || 'Password change failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password change failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 