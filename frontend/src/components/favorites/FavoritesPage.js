import React from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Heart, Calendar, MapPin, Star, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
    const { favorites, loading, error, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                {error}
            </div>
        );
    }

    const favoriteEvents = favorites.filter(fav => fav.type === 'event');
    const favoriteOrganizations = favorites.filter(fav => fav.type === 'organization');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

            <Tabs defaultValue="events" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="events" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Events ({favoriteEvents.length})
                    </TabsTrigger>
                    <TabsTrigger value="organizations" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Organizations ({favoriteOrganizations.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                    {favoriteEvents.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No favorite events yet</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => navigate('/events')}
                            >
                                Browse Events
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favoriteEvents.map(event => (
                                <Card key={event._id} className="overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                            onClick={() => toggleFavorite(event._id)}
                                        >
                                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">{event.name}</h3>
                                        <p className="text-sm text-gray-500">{event.organization.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">{event.rating} ({event.reviewCount} reviews)</span>
                                        </div>
                                        <Button
                                            className="w-full mt-4"
                                            onClick={() => navigate(`/events/${event._id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="organizations">
                    {favoriteOrganizations.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No favorite organizations yet</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => navigate('/organizations')}
                            >
                                Browse Organizations
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favoriteOrganizations.map(org => (
                                <Card key={org._id} className="overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={org.logoUrl}
                                            alt={org.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                            onClick={() => toggleFavorite(org._id)}
                                        >
                                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">{org.name}</h3>
                                        <p className="text-sm text-gray-500">{org.type}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{org.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">{org.rating} ({org.reviewCount} reviews)</span>
                                        </div>
                                        <Button
                                            className="w-full mt-4"
                                            onClick={() => navigate(`/organizations/${org._id}`)}
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FavoritesPage; 