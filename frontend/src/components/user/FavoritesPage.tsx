import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Building2, Calendar, MapPin, Star, Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Badge } from '../ui/badge';
import { Image } from '../ui/image';
import { ImageIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

interface Organization {
    _id: string;
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    locations: Array<{
        address: string;
        city: string;
        state: string;
        country: string;
    }>;
}

interface Event {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    location: string;
    category: string;
    type: string;
    rating: number;
    reviews: number;
    date: string;
    organization: {
        name: string;
        logo: string;
    };
}

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const [activeTab, setActiveTab] = useState('events');

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/favorites`);
            if (response.data.success) {
                // Filter only event favorites
                const eventFavorites = response.data.data.filter(
                    (fav: any) => fav.type === 'event'
                );
                setFavorites(eventFavorites);
            } else {
                setError(response.data.error || 'Failed to fetch favorites');
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch favorites');
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (eventId: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/favorites/event/${eventId}`);
            if (response.data.success) {
                setFavorites(favorites.filter(event => event._id !== eventId));
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const favoritedEvents = favorites.filter(fav => fav.type === 'event');
    const favoritedOrgs = favorites.filter(fav => fav.type === 'organization');

    const handleFavoriteToggle = async (type: string, itemId: string) => {
        await toggleFavorite(type, itemId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

            <Tabs defaultValue="events" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="organizations">Organizations</TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : favorites.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No favorite events yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((event) => (
                                <Card key={event._id} className="overflow-hidden">
                                    <div className="relative h-48 bg-gray-100">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl">{event.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{event.category}</Badge>
                                            <Badge variant="secondary">{event.type}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500 mb-2">{event.location}</p>
                                        <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-500">★</span>
                                            <span>{(event.rating || 0).toFixed(1)}</span>
                                            <span className="text-gray-500">({event.reviews || 0} reviews)</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/user/events/${event._id}`)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleRemoveFavorite(event._id)}
                                        >
                                            Remove
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="organizations">
                    <div className="text-center py-8">
                        <p className="text-gray-500">Organization favorites coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FavoritesPage; 