import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Auth-specific routes
const AUTH_ROUTES = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    profile: `${API_BASE_URL}/auth/profile`,
    checkAuth: `${API_BASE_URL}/auth/check-auth`,
    logout: `${API_BASE_URL}/auth/logout`,
    changePassword: `${API_BASE_URL}/auth/change-password`
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

    // Configure axios defaults
    axios.defaults.baseURL = API_BASE_URL;

    // Add token to requests if it exists
    const setAuthToken = (userToken) => {
        if (userToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            localStorage.setItem('userToken', userToken);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('userToken');
        }
    };

    // Check authentication status on mount and token expiration
    useEffect(() => {
        const checkAuth = async () => {
            const userToken = localStorage.getItem('userToken');
            if (userToken) {
                setAuthToken(userToken);
                try {
                    const response = await axios.get(AUTH_ROUTES.checkAuth);
                    if (response.data.isAuthenticated) {
                        setUser(response.data.user);
                    } else {
                        setAuthToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    setAuthToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Set up axios interceptor for token expiration
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    setAuthToken(null);
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(AUTH_ROUTES.login, { email, password });
            const { userToken, user } = response.data;
            setAuthToken(userToken);
            setUser(user);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post(AUTH_ROUTES.register, userData);
            const { userToken, user } = response.data;
            setAuthToken(userToken);
            setUser(user);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post(AUTH_ROUTES.logout);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthToken(null);
            setUser(null);
        }
    };

    // Update profile function
    const updateProfile = async (profileData) => {
        try {
            setError(null);
            const response = await axios.put(AUTH_ROUTES.profile, profileData);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Change password function
    const changePassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            await axios.put(AUTH_ROUTES.changePassword, {
                currentPassword,
                newPassword
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Password change failed';
            setError(message);
            return { success: false, message };
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 