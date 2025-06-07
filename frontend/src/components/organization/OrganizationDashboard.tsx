import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { Users, UserCircle, Building2, Calendar, Settings, Package, IndianRupee, Clock, Edit2, Plus, Mail, Phone, MapPin, BadgeCheck, XCircle } from 'lucide-react';
import { organization as BASE_URL, eventTypesRoute, facilitiesRoute, bookingsRoute } from '../../constants';
import { Carousel } from '../ui/carousel';

interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface Contact {
    name: string;
    email: string;
    phone: string;
    address: Address;
}

interface Space {
    _id: string;
    name: string;
    capacity: number;
    pricePerHour: number;
    facilities: string[];
}

interface Location {
    _id: string;
    name: string;
    address: Address;
    spaces: Space[];
}

interface Facility {
    _id: string;
    name: string;
    description: string;
    price: number;
}

interface Package {
    name: string;
    description: string;
    price: number;
    duration: number;
    maxCapacity?: number;
}

interface EventType {
    _id: string;
    type: string;
    subType: string;
    requiredFields: string[];
    packages: Package[];
    galleryImages?: string[];
    imageUrl?: string;
    category: string;
    description: string;
}

interface Booking {
    _id: string;
    eventType: EventType;
    package: Package;
    date: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    customer: {
        name: string;
        email: string;
        phone: string;
    };
}

interface Organization {
    _id: string;
    name: string;
    type: string;
    contact: Contact;
    gstNumber?: string;
    status: 'active' | 'inactive';
    locations: Location[];
    facilities: Facility[];
    eventTypes: EventType[];
}

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'medical':
            return '🏥';
        case 'social':
            return '🎉';
        case 'corporate':
            return '💼';
        default:
            return '📅';
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'medical':
            return 'bg-blue-100 text-blue-800';
        case 'social':
            return 'bg-pink-100 text-pink-800';
        case 'corporate':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const OrganizationDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                navigate('/organization/login');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Fetch organization data
            try {
                const orgResponse = await axios.get(`${BASE_URL}/profile`, config);
                if (orgResponse.data.success) {
                    setOrganization(orgResponse.data.data);
                } else {
                    setError(orgResponse.data.error || 'Failed to fetch organization data');
                }
            } catch (orgError: any) {
                if (orgError.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/organization/login');
                    return;
                } else if (orgError.response?.status === 404) {
                    setError('Organization profile not found');
                } else {
                    setError(orgError.response?.data?.error || 'Failed to fetch organization data');
                }
            }

            // Fetch bookings data
            try {
                const bookingsResponse = await axios.get(bookingsRoute, config);
                if (bookingsResponse.data.success) {
                    setBookings(bookingsResponse.data.data || []);
                } else {
                    setError(bookingsResponse.data.error || 'Failed to fetch bookings');
                    setBookings([]);
                }
            } catch (bookingError: any) {
                if (bookingError.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/organization/login');
                    return;
                } else if (bookingError.response?.status === 404) {
                    setError('No bookings found');
                    setBookings([]);
                } else {
                    setError(bookingError.response?.data?.error || 'Failed to fetch bookings');
                    setBookings([]);
                }
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch data');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-500" /> Organization Details
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Name</span>
                        <span className="font-medium ml-2">{organization?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="font-medium ml-2">{organization?.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="ml-2">
                            <Badge className={organization?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {organization?.status}
                            </Badge>
                        </span>
                    </div>
                    {organization?.gstNumber && (
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-5 w-5 text-blue-400" />
                            <span className="text-sm text-gray-500">GST Number</span>
                            <span className="font-medium ml-2">{organization.gstNumber}</span>
                        </div>
                    )}
                </div>
            </Card>
            <Card className="p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-500" /> Contact Information
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Contact Person</span>
                        <span className="font-medium ml-2">{organization?.contact.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="font-medium ml-2">{organization?.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-gray-500">Phone</span>
                        <span className="font-medium ml-2">{organization?.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Address</span>
                        <span className="font-medium ml-2">
                            {organization?.contact.address.street}, {organization?.contact.address.city}, {organization?.contact.address.state}, {organization?.contact.address.country} {organization?.contact.address.zipCode}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderEventTypes = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Event Types</h3>
                <Button onClick={() => navigate('/organization/event-types/new')} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Event Type
                </Button>
            </div>

            {organization?.eventTypes.length === 0 ? (
                <Card className="p-6 text-center">
                    <p className="text-gray-500">No event types found. Add your first event type to get started.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {organization?.eventTypes.map(eventType => (
                        <Card key={eventType._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {(eventType.galleryImages && eventType.galleryImages.length > 0) ? (
                                <div className="relative">
                                    <Carousel className="w-full">
                                        {eventType.galleryImages.map((image, index) => (
                                            <img
                                                src={image}
                                                key={index}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-48 md:h-72 lg:h-96 object-cover rounded-lg"
                                                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
                                            />
                                        ))}
                                    </Carousel>
                                    <Badge className={`absolute top-4 right-4 ${getCategoryColor(eventType.category)}`}>
                                        {getCategoryIcon(eventType.category)} {eventType.category}
                                    </Badge>
                                </div>
                            ) : (
                                eventType.imageUrl && (
                                    <div className="relative">
                                        <img
                                            src={eventType.imageUrl}
                                            alt={eventType.type}
                                            className="w-full h-48 md:h-72 lg:h-96 object-cover rounded-lg"
                                            onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
                                        />
                                        <Badge className={`absolute top-4 right-4 ${getCategoryColor(eventType.category)}`}>
                                            {getCategoryIcon(eventType.category)} {eventType.category}
                                        </Badge>
                                    </div>
                                )
                            )}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h4 className="text-xl font-semibold">{eventType.type}</h4>
                                    <p className="text-sm text-gray-500">{eventType.subType}</p>
                                </div>
                                <p className="text-gray-600 line-clamp-2">{eventType.description}</p>
                                <div className="space-y-4">
                                    <h5 className="font-medium flex items-center gap-2">
                                        <Package className="h-4 w-4" /> Packages
                                    </h5>
                                    <div className="grid gap-3">
                                        {eventType.packages.map(pkg => (
                                            <div key={pkg.name} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">{pkg.name}</p>
                                                        <p className="text-sm text-gray-500">{pkg.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold flex items-center gap-1">
                                                            <IndianRupee className="h-4 w-4" />
                                                            {pkg.price?.toLocaleString?.() ?? pkg.price}
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {pkg.duration} hours
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                    <Users className="h-4 w-4" />
                                                    Max Capacity: {pkg.maxCapacity ?? '-'} people
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/organization/event-types/${eventType._id}`)}
                                        className="flex items-center gap-2"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const renderBookings = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-500" /> Recent Bookings
            </h3>
            {!bookings || bookings.length === 0 ? (
                <Card className="p-6 text-center">
                    <p className="text-gray-500">No bookings found.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <Card key={booking._id} className="p-6 flex flex-col md:flex-row gap-6 items-start">
                            {/* Event Image or Gallery */}
                            <div className="w-full md:w-1/3">
                                {(booking.eventType.galleryImages && booking.eventType.galleryImages.length > 0) ? (
                                    <Carousel className="w-full">
                                        {booking.eventType.galleryImages.map((image, index) => (
                                            <img
                                                src={image}
                                                key={index}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-32 md:h-40 lg:h-48 object-cover rounded-lg"
                                                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
                                            />
                                        ))}
                                    </Carousel>
                                ) : (
                                    booking.eventType.imageUrl && (
                                        <img
                                            src={booking.eventType.imageUrl}
                                            alt={booking.eventType.type}
                                            className="w-full h-32 md:h-40 lg:h-48 object-cover rounded-lg"
                                            onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
                                        />
                                    )
                                )}
                            </div>
                            {/* Booking Details */}
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold flex items-center gap-2">
                                            {booking.eventType.type}
                                            <Badge className={`ml-2 ${getCategoryColor(booking.eventType.category)}`}>
                                                {getCategoryIcon(booking.eventType.category)} {booking.eventType.category}
                                            </Badge>
                                        </h4>
                                        <p className="text-sm text-gray-500">{booking.eventType.subType}</p>
                                    </div>
                                    <Badge variant={
                                        booking.status === 'confirmed' ? 'secondary' :
                                            booking.status === 'cancelled' ? 'destructive' :
                                                'default'
                                    }>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm text-gray-500">Date</span>
                                        <span className="font-medium ml-1">{new Date(booking.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-purple-400" />
                                        <span className="text-sm text-gray-500">Time</span>
                                        <span className="font-medium ml-1">{booking.startTime} - {booking.endTime}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">Customer</span>
                                    <span className="font-medium ml-1">{booking.customer.name}</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{booking.package.name}</p>
                                            <p className="text-sm text-gray-500">{booking.package.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold flex items-center gap-1">
                                                <IndianRupee className="h-4 w-4" />
                                                {booking.package.price?.toLocaleString?.() ?? booking.package.price}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {booking.package.duration} hours
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <Users className="h-4 w-4" />
                                        Max Capacity: {booking.package.maxCapacity ?? '-'} people
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <Button onClick={() => navigate('/organization/profile')}>
                    Edit Profile
                </Button>
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="event-types">Event Types</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    {renderOverview()}
                </TabsContent>

                <TabsContent value="event-types">
                    {renderEventTypes()}
                </TabsContent>

                <TabsContent value="bookings">
                    {renderBookings()}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrganizationDashboard; 