import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Search, MapPin, Calendar, Star, Heart, Filter } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { DateRangePicker } from '../ui/date-range-picker';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        dateRange: null,
        facilities: [],
        priceRange: [0, 1000],
        minRating: 0
    });
    const [showFilters, setShowFilters] = useState(false);

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/events');
            setEvents(response.data.events);
        } catch (error) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    const handleLocationChange = (e) => {
        setFilters(prev => ({
            ...prev,
            location: e.target.value
        }));
    };

    const handleDateRangeChange = (range) => {
        setFilters(prev => ({
            ...prev,
            dateRange: range
        }));
    };

    const handleFacilityToggle = (facility) => {
        setFilters(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handlePriceRangeChange = (value) => {
        setFilters(prev => ({
            ...prev,
            priceRange: value
        }));
    };

    const handleRatingChange = (value) => {
        setFilters(prev => ({
            ...prev,
            minRating: value
        }));
    };

    const toggleFavorite = async (eventId) => {
        try {
            await axios.post(`/api/events/${eventId}/favorite`);
            // Update local state to reflect the change
            setEvents(prev => prev.map(event =>
                event._id === eventId
                    ? { ...event, isFavorite: !event.isFavorite }
                    : event
            ));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            event.organization.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesLocation = !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesDateRange = !filters.dateRange || (
            new Date(event.date) >= filters.dateRange.from &&
            new Date(event.date) <= filters.dateRange.to
        );
        const matchesFacilities = filters.facilities.length === 0 ||
            filters.facilities.every(facility => event.facilities.includes(facility));
        const matchesPrice = event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1];
        const matchesRating = event.rating >= filters.minRating;

        return matchesSearch && matchesLocation && matchesDateRange &&
            matchesFacilities && matchesPrice && matchesRating;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Search and Filter Section */}
                <div className="w-full md:w-1/4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Filters</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="search"
                                        placeholder="Search events or organizations..."
                                        value={filters.search}
                                        onChange={handleSearch}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="location"
                                        placeholder="Enter location..."
                                        value={filters.location}
                                        onChange={handleLocationChange}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            {showFilters && (
                                <>
                                    <div>
                                        <Label>Date Range</Label>
                                        <DateRangePicker
                                            value={filters.dateRange}
                                            onChange={handleDateRangeChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Price Range</Label>
                                        <Slider
                                            value={filters.priceRange}
                                            onValueChange={handlePriceRangeChange}
                                            min={0}
                                            max={1000}
                                            step={10}
                                            className="mt-2"
                                        />
                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                            <span>${filters.priceRange[0]}</span>
                                            <span>${filters.priceRange[1]}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Minimum Rating</Label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Slider
                                                value={[filters.minRating]}
                                                onValueChange={([value]) => handleRatingChange(value)}
                                                min={0}
                                                max={5}
                                                step={0.5}
                                                className="flex-1"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {filters.minRating}★
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Facilities</Label>
                                        <div className="space-y-2 mt-2">
                                            {['Parking', 'Catering', 'WiFi', 'AV Equipment', 'Seating'].map(facility => (
                                                <div key={facility} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={facility}
                                                        checked={filters.facilities.includes(facility)}
                                                        onCheckedChange={() => handleFacilityToggle(facility)}
                                                    />
                                                    <Label htmlFor={facility}>{facility}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Events List Section */}
                <div className="w-full md:w-3/4">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center text-gray-500">No events found</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEvents.map(event => (
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
                                            <Heart
                                                className={`h-5 w-5 ${event.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
                                                    }`}
                                            />
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
                                        <Separator className="my-3" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">${event.price}</span>
                                            <Button size="sm">View Details</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsPage; 