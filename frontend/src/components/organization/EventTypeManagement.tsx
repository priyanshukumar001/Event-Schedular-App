import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { eventTypesRoute, facilitiesRoute, organization } from '../../constants';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../ui/loadingSpinner';
import { EventType, Facility } from '../../types/event';
import { ORGANIZATION_EVENT_MAPPING } from '../../constants/organizationEventMapping';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import { Calendar, Users, Clock, IndianRupee, Image as ImageIcon, Package, Trash2, Edit2, Plus } from 'lucide-react';
import { Carousel } from '../ui/carousel';
import {
    getEventCategories,
    getSubCategories,
    getSubSubCategories,
    isValidEventCategoryForOrganization
} from '../../constants/eventCategories';
import { Image } from '@/components/ui/image';

const EventTypeManagement: React.FC = () => {
    const navigate = useNavigate();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedSubType, setSelectedSubType] = useState<string>('all');
    const [organizationType, setOrganizationType] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/organization/login');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Fetch organization data to get type
            const orgResponse = await axios.get(`${organization}/profile`, config);
            if (orgResponse.data.success) {
                setOrganizationType(orgResponse.data.data.type);
            }

            const [eventTypesResponse, facilitiesResponse] = await Promise.all([
                axios.get(eventTypesRoute, config),
                axios.get(facilitiesRoute, config)
            ]);

            if (eventTypesResponse.data.success) {
                setEventTypes(eventTypesResponse.data.data);
            } else {
                setError(eventTypesResponse.data.error || 'Failed to fetch event types');
            }

            if (facilitiesResponse.data.success) {
                setFacilities(facilitiesResponse.data.data);
            } else {
                setError(facilitiesResponse.data.error || 'Failed to fetch facilities');
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/organization/login');
            }
            setError(error.response?.data?.error || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Get allowed categories based on organization type
    const getAllowedCategories = () => {
        return ORGANIZATION_EVENT_MAPPING[organizationType] || [];
    };

    // Filter event types based on selected filters
    const filteredEventTypes = eventTypes.filter(type => {
        const categoryMatch = selectedCategory === 'all' || type.category === selectedCategory;
        const typeMatch = selectedType === 'all' || type.type === selectedType;
        const subTypeMatch = selectedSubType === 'all' || type.subType === selectedSubType;
        return categoryMatch && typeMatch && subTypeMatch;
    });

    // Get unique types for the selected category
    const getTypesForCategory = (category: string): string[] => {
        if (category === 'all') return [];
        return getSubCategories(category).map(type => type.value);
    };

    // Get unique subtypes for the selected type
    const getSubTypesForType = (type: string): string[] => {
        if (type === 'all') return [];
        return getSubSubCategories(selectedCategory, type).map(subType => subType.value);
    };

    const handleDelete = async (id: string) => {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            setError('Invalid event type ID');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this event type?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/organization/login');
                return;
            }

            const response = await axios.delete(`${eventTypesRoute}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setEventTypes(prev => prev.filter(type => type._id !== id));
            } else {
                setError(response.data.error || 'Failed to delete event type');
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setError('Event type not found');
            } else if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/organization/login');
            } else {
                setError(error.response?.data?.error || 'Failed to delete event type');
            }
        }
    };

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

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Event Types</h1>
                    <p className="text-gray-600">Manage your event types and packages</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                            setSelectedCategory(value);
                            setSelectedType('all');
                            setSelectedSubType('all');
                        }}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {getEventCategories()
                                .filter(cat => isValidEventCategoryForOrganization(organizationType, cat.value))
                                .map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    {selectedCategory !== 'all' && (
                        <Select
                            value={selectedType}
                            onValueChange={(value) => {
                                setSelectedType(value);
                                setSelectedSubType('all');
                            }}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {getSubCategories(selectedCategory).map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {selectedType !== 'all' && (
                        <Select
                            value={selectedSubType}
                            onValueChange={setSelectedSubType}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Select subtype" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subtypes</SelectItem>
                                {getSubSubCategories(selectedCategory, selectedType).map((subType) => (
                                    <SelectItem key={subType.value} value={subType.value}>
                                        {subType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Button
                        onClick={() => navigate('/organization/event-types/new')}
                        className="w-full md:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event Type
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    {error}
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEventTypes.map(eventType => (
                    <Card key={eventType._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48">
                            {eventType.imageUrl ? (
                                <Image
                                    src={eventType.imageUrl}
                                    alt={eventType.type}
                                    className="w-full h-full object-cover"
                                    fallbackIcon={<ImageIcon className="h-12 w-12 text-gray-400" />}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                            <Badge
                                className={`absolute top-4 right-4 ${getCategoryColor(eventType.category)}`}
                            >
                                {getCategoryIcon(eventType.category)} {eventType.category}
                            </Badge>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold">{eventType.type}</h3>
                                <p className="text-sm text-gray-500">{eventType.subType}</p>
                            </div>

                            <p className="text-gray-600 line-clamp-2">{eventType.description}</p>

                            {eventType.galleryImages && eventType.galleryImages.length > 0 && (
                                <div className="relative">
                                    <Carousel className="w-full">
                                        {eventType.galleryImages.map((image, index) => (
                                            <Image
                                                src={image}
                                                key={index}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-48 md:h-72 lg:h-96 object-cover rounded-lg"
                                                fallbackIcon={<ImageIcon className="h-12 w-12 text-gray-400" />}
                                            />
                                        ))}
                                    </Carousel>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="font-medium flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Packages
                                </h4>
                                <div className="grid gap-3">
                                    {eventType.packages.map(pkg => (
                                        <div key={pkg._id} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{pkg.name}</p>
                                                    <p className="text-sm text-gray-500">{pkg.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold flex items-center gap-1">
                                                        <IndianRupee className="h-4 w-4" />
                                                        {pkg.price.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {pkg.duration} hours
                                                    </p>
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

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/organization/event-types/${eventType._id}`)}
                                    className="flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(eventType._id)}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EventTypeManagement; 