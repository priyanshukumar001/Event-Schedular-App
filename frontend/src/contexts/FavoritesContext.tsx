import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../constants';

interface Favorite {
    type: string;
    data: {
        _id: string;
        [key: string]: any;
    };
}

interface FavoritesContextType {
    favorites: Favorite[];
    loading: boolean;
    error: string | null;
    toggleFavorite: (type: string, itemId: string) => Promise<{ success: boolean; message?: string }>;
    isFavorite: (type: string, itemId: string) => boolean;
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user's favorites on mount and when user changes
    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavorites([]);
            setLoading(false);
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/favorites`);
            if (response.data.success) {
                setFavorites(response.data.data || []);
            } else {
                setFavorites([]);
                setError(response.data.message || 'Failed to fetch favorites');
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
            setError('Failed to fetch favorites');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (type: string, itemId: string) => {
        try {
            const isFavorite = favorites.some(fav => fav.type === type && fav.data._id === itemId);
            if (isFavorite) {
                await axios.delete(`${API_BASE_URL}/api/favorites/${type}/${itemId}`);
                setFavorites(prev => prev.filter(fav => !(fav.type === type && fav.data._id === itemId)));
            } else {
                const response = await axios.post(`${API_BASE_URL}/api/favorites`, { type, itemId });
                if (response.data.success) {
                    setFavorites(prev => [...prev, response.data.data]);
                }
            }
            return { success: true };
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return { success: false, message: 'Failed to update favorite' };
        }
    };

    const isFavorite = (type: string, itemId: string) => {
        if (!Array.isArray(favorites)) return false;
        return favorites.some(fav => fav.type === type && fav.data._id === itemId);
    };

    const value: FavoritesContextType = {
        favorites,
        loading,
        error,
        toggleFavorite,
        isFavorite,
        refreshFavorites: fetchFavorites
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}; 