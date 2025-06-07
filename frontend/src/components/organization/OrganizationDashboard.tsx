import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { UserCircle, Building2, Calendar, Users, Settings } from 'lucide-react';
import { organization as BASE_URL } from '../../constants';

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
}

interface EventType {
    _id: string;
    type: string;
    subType: string;
    requiredFields: string[];
    packages: Package[];
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

            const [orgResponse, bookingsResponse] = await Promise.all([
                axios.get(`${BASE_URL}/profile`, config),
                axios.get(`${BASE_URL}/bookings`, config)
            ]);

            if (orgResponse.data.success) {
                setOrganization(orgResponse.data.data);
            } else {
                setError(orgResponse.data.error || 'Failed to fetch organization data');
            }

            if (bookingsResponse.data.success) {
                setBookings(bookingsResponse.data.data || []);
            } else {
                setError(bookingsResponse.data.error || 'Failed to fetch bookings');
                setBookings([]);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/organization/login');
            }
            setError(error.response?.data?.error || 'Failed to fetch data');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{organization?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">{organization?.type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium capitalize">{organization?.status}</p>
                    </div>
                    {organization?.gstNumber && (
                        <div>
                            <p className="text-sm text-gray-500">GST Number</p>
                            <p className="font-medium">{organization.gstNumber}</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">{organization?.contact.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{organization?.contact.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{organization?.contact.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                            {organization?.contact.address.street}<br />
                            {organization?.contact.address.city}, {organization?.contact.address.state}<br />
                            {organization?.contact.address.country} {organization?.contact.address.zipCode}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderEventTypes = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Event Types</h3>
                <Button onClick={() => navigate('/organization/event-types/new')}>
                    Add Event Type
                </Button>
            </div>

            {organization?.eventTypes.length === 0 ? (
                <Card className="p-6 text-center">
                    <p className="text-gray-500">No event types found. Add your first event type to get started.</p>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {organization?.eventTypes.map(eventType => (
                        <Card key={eventType._id} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium">{eventType.type}</h4>
                                    <p className="text-sm text-gray-500">{eventType.subType}</p>
                                </div>

                                <div>
                                    <h5 className="text-sm font-medium mb-2">Packages</h5>
                                    <div className="space-y-2">
                                        {eventType.packages.map((pkg, index) => (
                                            <div key={index} className="text-sm">
                                                <p className="font-medium">{pkg.name}</p>
                                                <p className="text-gray-500">{pkg.description}</p>
                                                <p className="text-gray-600">
                                                    ${pkg.price} • {pkg.duration} hours
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/organization/event-types/${eventType._id}`)}
                                    >
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
            <h3 className="text-lg font-semibold">Recent Bookings</h3>

            {!bookings || bookings.length === 0 ? (
                <Card className="p-6 text-center">
                    <p className="text-gray-500">No bookings found.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <Card key={booking._id} className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{booking.eventType.type}</h4>
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
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium">
                                            {booking.startTime} - {booking.endTime}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Package</p>
                                    <p className="font-medium">{booking.package.name}</p>
                                    <p className="text-sm text-gray-500">{booking.package.description}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p className="font-medium">{booking.customer.name}</p>
                                    <p className="text-sm text-gray-500">{booking.customer.email}</p>
                                    <p className="text-sm text-gray-500">{booking.customer.phone}</p>
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