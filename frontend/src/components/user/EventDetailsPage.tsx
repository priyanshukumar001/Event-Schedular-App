import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Calendar, MapPin, Star, Heart, Building2, Clock, Users, Package, IndianRupee, ImageIcon, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Badge } from '../ui/badge';
import { Image } from '../ui/image';
import { API_BASE_URL } from '../../constants';
import { Carousel } from '../ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { useCart } from '../../contexts/CartContext';

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

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

const EventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToCart } = useCart();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
            if (response.data.success) {
                setEvent(response.data.data);
                // Fetch available slots after getting event details
                fetchAvailableSlots();
            } else {
                setError(response.data.message || 'Failed to fetch event details');
            }
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Error fetching event details');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/${id}/slots`);
            if (response.data.success) {
                setAvailableSlots(response.data.data || []);
            } else {
                setError(response.data.message || 'Failed to fetch available slots');
            }
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Error fetching available slots');
        }
    };

    const handlePackageSelect = (packageId: string) => {
        setSelectedPackage(packageId);
        // Reset selected facilities when package changes
        setSelectedFacilities([]);
    };

    const handleFacilityToggle = (facilityId: string) => {
        setSelectedFacilities(prev =>
            prev.includes(facilityId)
                ? prev.filter(id => id !== facilityId)
                : [...prev, facilityId]
        );
    };

    const handleDateSelect = (slot: Slot) => {
        setSelectedSlot(slot);
    };

    const handleAddToCart = () => {
        if (!event || !selectedPackage || !selectedSlot) {
            return;
        }
        const selectedPackageData = event.packages.find(pkg => pkg._id === selectedPackage);
        if (!selectedPackageData) return;

        const cartItem = {
            eventId: event._id,
            eventName: event.name,
            packageId: selectedPackage,
            packageName: selectedPackageData.name,
            slotId: selectedSlot._id,
            date: selectedSlot.date,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            basePrice: selectedPackageData.price,
            facilities: selectedFacilities.map(facilityId => {
                const facility = selectedPackageData.includedFacilities.find(f => f._id === facilityId);
                return {
                    id: facilityId,
                    name: facility?.name || '',
                    price: facility?.price || 0
                };
            }),
            totalPrice: selectedPackageData.price + selectedFacilities.reduce((total, facilityId) => {
                const facility = selectedPackageData.includedFacilities.find(f => f._id === facilityId);
                return total + (facility?.price || 0);
            }, 0)
        };

        addToCart(cartItem);
        navigate('/cart');
    };

    const handleFavoriteClick = async () => {
        if (!user) {
            navigate('/user/login');
            return;
        }
        if (event) {
            await toggleFavorite('event', event._id);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error || 'Event not found'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => navigate(-1)}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Events
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Details Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">{event.name}</h1>
                            <p className="text-gray-500 flex items-center gap-2 mt-2">
                                <Building2 className="h-4 w-4" />
                                {event.organization.name}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleFavoriteClick}
                        >
                            <Heart
                                className={`h-6 w-6 ${isFavorite('event', event._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                            />
                        </Button>
                    </div>

                    {/* Event Images */}
                    <div className="relative">
                        {event.galleryImages && event.galleryImages.length > 0 ? (
                            <Carousel>
                                {event.galleryImages.map((image, index) => (
                                    <div key={index} className="relative h-[400px]">
                                        <Image
                                            src={image}
                                            alt={`${event.name} - Image ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                            fallbackIcon={<ImageIcon className="h-12 w-12 text-gray-400" />}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <div className="relative h-[400px]">
                                <Image
                                    src={event.imageUrl}
                                    alt={event.name}
                                    className="w-full h-full object-cover rounded-lg"
                                    fallbackIcon={<ImageIcon className="h-12 w-12 text-gray-400" />}
                                />
                            </div>
                        )}
                        <Badge className="absolute top-4 left-4">
                            {event.category}
                        </Badge>
                    </div>

                    {/* Event Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="organization">Organization</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                                <p className="text-gray-600">{event.description}</p>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Event Type</h2>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Category:</span> {event.category}</p>
                                    <p><span className="font-medium">Type:</span> {event.type}</p>
                                    {event.subType && <p><span className="font-medium">Sub Type:</span> {event.subType}</p>}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="organization" className="space-y-4">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Host Organization</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium">{event.organization.name}</h3>
                                        <p className="text-sm text-gray-500">{event.organization.type}</p>
                                    </div>
                                    <div className="space-y-2">
                                        {event.organization.locations.map((location, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p>{location.address}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {location.city}, {location.state}, {location.country}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-5 w-5 text-yellow-500" />
                                            <span>{event.rating} ({event.reviewCount} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-gray-500" />
                                            <span>{event.organization.contact.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                            <span>{event.organization.contact.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="space-y-4">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="h-6 w-6 text-yellow-500" />
                                    <span className="text-2xl font-bold">{event.rating}</span>
                                    <span className="text-gray-500">({event.reviewCount} reviews)</span>
                                </div>
                                <p className="text-gray-500">Reviews coming soon...</p>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Booking Section */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Book this event</h2>

                        {/* Package Selection */}
                        <div className="space-y-4">
                            <Label>Select a Package</Label>
                            <div className="space-y-2">
                                {event.packages.map(pkg => (
                                    <div
                                        key={pkg._id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPackage === pkg._id
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => handlePackageSelect(pkg._id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{pkg.name}</h3>
                                                <p className="text-sm text-gray-500">{pkg.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${pkg.price}</p>
                                                <p className="text-sm text-gray-500">{pkg.duration} hours</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <Users className="h-4 w-4" />
                                            Max Capacity: {pkg.maxCapacity} people
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Date and Time Selection */}
                        <div className="space-y-4">
                            <Label>Select Slot</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {availableSlots.map((slot) => (
                                    <Button
                                        key={slot._id}
                                        variant={selectedSlot?._id === slot._id ? 'default' : 'outline'}
                                        className="h-10"
                                        onClick={() => handleDateSelect(slot)}
                                        disabled={slot.isBooked}
                                    >
                                        {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Additional Facilities */}
                        {selectedPackage && (
                            <div className="space-y-4">
                                <Label>Additional Facilities</Label>
                                <div className="space-y-2">
                                    {event.packages
                                        .find(pkg => pkg._id === selectedPackage)
                                        ?.includedFacilities.map(facility => (
                                            <div key={facility._id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={facility._id}
                                                    checked={selectedFacilities.includes(facility._id)}
                                                    onCheckedChange={() => handleFacilityToggle(facility._id)}
                                                />
                                                <Label htmlFor={facility._id} className="flex-1">
                                                    <div className="flex justify-between">
                                                        <span>{facility.name}</span>
                                                        <span className="text-gray-500">${facility.price}</span>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        <Separator className="my-6" />

                        {/* Booking Summary */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Booking Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Package</span>
                                    <span>
                                        ${event.packages.find(pkg => pkg._id === selectedPackage)?.price || 0}
                                    </span>
                                </div>
                                {selectedFacilities.length > 0 && (
                                    <div className="flex justify-between">
                                        <span>Additional Facilities</span>
                                        <span>
                                            ${selectedFacilities.reduce((total, facilityId) => {
                                                const facility = event.packages
                                                    .find(pkg => pkg._id === selectedPackage)
                                                    ?.includedFacilities.find(f => f._id === facilityId);
                                                return total + (facility?.price || 0);
                                            }, 0)}
                                        </span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>
                                        ${(event.packages.find(pkg => pkg._id === selectedPackage)?.price || 0) +
                                            selectedFacilities.reduce((total, facilityId) => {
                                                const facility = event.packages
                                                    .find(pkg => pkg._id === selectedPackage)
                                                    ?.includedFacilities.find(f => f._id === facilityId);
                                                return total + (facility?.price || 0);
                                            }, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6"
                            disabled={!selectedPackage || !selectedSlot}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage; 