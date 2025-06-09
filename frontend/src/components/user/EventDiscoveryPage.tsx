import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Search, MapPin, Calendar, Star, Heart, Filter, Building2, Clock, Users, Package, IndianRupee } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { DateRangePicker } from '../ui/date-range-picker';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Badge } from '../ui/badge';
import { Image } from '../ui/image';
import { ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../constants';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';

interface Facility {
    _id: string;
    name: string;
    description: string;
    price: number;
    priceUnit: 'hour' | 'day' | 'event';
    category: string;
    isAvailable: boolean;
}

interface Package {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    maxCapacity: number;
    includedFacilities: Facility[];
}

interface Event {
    _id: string;
    name: string;
    type: string;
    subType: string;
    category: string;
    description: string;
    imageUrl: string;
    galleryImages: string[];
    date: string;
    organization: {
        _id: string;
        name: string;
        type: string;
        contact: {
            email: string;
            phone: string;
        };
        locations: Array<{
            address: string;
            city: string;
            state: string;
            country: string;
        }>;
    };
    packages: Package[];
    rating: number;
    reviewCount: number;
    isFavorite?: boolean;
}

const EventDiscoveryPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        dateRange: null as DateRange | null,
        facilities: [] as string[],
        priceRange: [0, 1000],
        minRating: 0,
        category: 'all',
        type: 'all',
        availableSlots: false
    });
    const [showFilters, setShowFilters] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<Record<string, number>>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchEvents();
        fetchCategories();
        fetchTypes();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            if (filters.search) queryParams.append('search', filters.search);
            if (filters.location) queryParams.append('location', filters.location);
            if (filters.dateRange) queryParams.append('dateRange', JSON.stringify(filters.dateRange));
            if (filters.facilities.length > 0) queryParams.append('facilities', JSON.stringify(filters.facilities));
            if (filters.priceRange) queryParams.append('priceRange', JSON.stringify(filters.priceRange));
            if (filters.minRating) queryParams.append('minRating', filters.minRating.toString());
            if (filters.category !== 'all') queryParams.append('category', filters.category);
            if (filters.type !== 'all') queryParams.append('type', filters.type);
            if (filters.availableSlots) queryParams.append('availableSlots', 'true');

            const response = await axios.get(`${API_BASE_URL}/api/events?${queryParams.toString()}`);
            if (response.data.success) {
                setEvents(response.data.data);
                // Fetch available slots for each event
                const slotsPromises = response.data.data.map(async (event: Event) => {
                    const slotsResponse = await axios.get(`${API_BASE_URL}/api/events/${event._id}/slots`);
                    if (slotsResponse.data.success) {
                        const availableCount = slotsResponse.data.data.filter((slot: any) => !slot.isBooked).length;
                        return [event._id, availableCount];
                    }
                    return [event._id, 0];
                });
                const slotsResults = await Promise.all(slotsPromises);
                const slotsMap = Object.fromEntries(slotsResults);
                setAvailableSlots(slotsMap);
            } else {
                setError(response.data.error || 'Failed to fetch events');
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch events');
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/categories/all`);
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/types/all`);
            if (response.data.success) {
                setTypes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            location: e.target.value
        }));
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setFilters(prev => ({
            ...prev,
            dateRange: range || null
        }));
    };

    const handleFacilityToggle = (facility: string) => {
        setFilters(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handlePriceRangeChange = (value: number[]) => {
        setFilters(prev => ({
            ...prev,
            priceRange: value
        }));
    };

    const handleRatingChange = (value: number) => {
        setFilters(prev => ({
            ...prev,
            minRating: value
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            category: value,
            type: 'all'
        }));
    };

    const handleTypeChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            type: value
        }));
    };

    const handleFavoriteToggle = async (eventId: string) => {
        if (!user) {
            navigate('/user/login');
            return;
        }
        try {
            await toggleFavorite('event', eventId);
            setEvents(prev => prev.map(event =>
                event._id === eventId
                    ? { ...event, isFavorite: !event.isFavorite }
                    : event
            ));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleApplyFilters = () => {
        fetchEvents();
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            location: '',
            dateRange: null,
            facilities: [],
            priceRange: [0, 1000],
            minRating: 0,
            category: 'all',
            type: 'all',
            availableSlots: false
        });
        fetchEvents();
    };

    const handleEventClick = (eventId: string) => {
        navigate(`/user/events/${eventId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Search and Filter Section */}
                <div className="w-full md:w-1/4">
                    <Card className="p-4 sticky top-4">
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
                                        placeholder="Enter city or state..."
                                        value={filters.location}
                                        onChange={handleLocationChange}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            {showFilters && (
                                <>
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Date & Availability</h3>
                                        <div>
                                            <Label>Date Range</Label>
                                            <DateRangePicker
                                                date={filters.dateRange || undefined}
                                                onDateChange={handleDateRangeChange}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="availableSlots"
                                                checked={filters.availableSlots}
                                                onCheckedChange={(checked) =>
                                                    setFilters(prev => ({ ...prev, availableSlots: checked as boolean }))
                                                }
                                            />
                                            <Label htmlFor="availableSlots">Show only events with available slots</Label>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Price & Rating</h3>
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
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Categories & Types</h3>
                                        <div>
                                            <Label>Category</Label>
                                            <select
                                                value={filters.category}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="w-full p-2 border rounded-md mt-1"
                                            >
                                                <option value="all">All Categories</option>
                                                {categories.map(category => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Type</Label>
                                            <select
                                                value={filters.type}
                                                onChange={(e) => handleTypeChange(e.target.value)}
                                                className="w-full p-2 border rounded-md mt-1"
                                            >
                                                <option value="all">All Types</option>
                                                {types.map(type => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Facilities</h3>
                                        <div className="space-y-2">
                                            {['Parking', 'Catering', 'WiFi', 'AV Equipment', 'Seating', 'Projector', 'Sound System', 'Catering Service', 'Security', 'Cleaning Service'].map(facility => (
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

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            className="flex-1"
                                            onClick={handleApplyFilters}
                                        >
                                            Apply Filters
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={handleResetFilters}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Events List Section */}
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Discover Events</h1>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No events found matching your criteria</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={handleResetFilters}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                            {events.map(event => (
                                <Card
                                    key={event._id}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex' : ''}`}
                                    onClick={() => handleEventClick(event._id)}
                                >
                                    <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                                        {event.imageUrl ? (
                                            <Image
                                                src={event.imageUrl}
                                                alt={event.name}
                                                className={`${viewMode === 'list' ? 'h-full' : 'h-48'} w-full object-cover`}
                                                fallbackIcon={<ImageIcon className="h-12 w-12 text-gray-400" />}
                                            />
                                        ) : (
                                            <div className={`${viewMode === 'list' ? 'h-full' : 'h-48'} w-full bg-gray-100 flex items-center justify-center`}>
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFavoriteToggle(event._id);
                                            }}
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${isFavorite('event', event._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                                            />
                                        </Button>
                                        <Badge className="absolute top-2 left-2">
                                            {event.category}
                                        </Badge>
                                        {availableSlots[event._id] > 0 && (
                                            <Badge variant="secondary" className="absolute bottom-2 left-2">
                                                {availableSlots[event._id]} slots available
                                            </Badge>
                                        )}
                                    </div>
                                    <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                                        <h3 className="font-semibold text-lg">{event.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            {event.organization.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">
                                                {event.organization.locations[0]?.city}, {event.organization.locations[0]?.state}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">
                                                {event.rating} ({event.reviewCount} reviews)
                                            </span>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-sm text-gray-500">Starting from</span>
                                                <p className="font-semibold">
                                                    ${Math.min(...event.packages.map(pkg => pkg.price))}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEventClick(event._id);
                                                }}
                                            >
                                                View Details
                                            </Button>
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

export default EventDiscoveryPage; 