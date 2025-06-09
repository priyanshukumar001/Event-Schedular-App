import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            const response = await axios.get('/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError('Failed to fetch favorites');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (type, itemId) => {
        try {
            const isFavorite = favorites.some(fav => fav.type === type && fav.data._id === itemId);
            if (isFavorite) {
                await axios.delete(`/favorites/${type}/${itemId}`);
                setFavorites(prev => prev.filter(fav => !(fav.type === type && fav.data._id === itemId)));
            } else {
                const response = await axios.post('/favorites', { type, itemId });
                setFavorites(prev => [...prev, response.data]);
            }
            return { success: true };
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return { success: false, message: 'Failed to update favorite' };
        }
    };

    const isFavorite = (type, itemId) => {
        return favorites.some(fav => fav.type === type && fav.data._id === itemId);
    };

    const value = {
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