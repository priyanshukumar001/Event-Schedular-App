import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { eventTypesRoute, facilitiesRoute } from '../../constants';
import { EventType, Facility } from '../../types/event';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

interface EventTypeFormData {
    category: 'medical' | 'social' | 'corporate';
    type: string;
    subType: string;
    description: string;
    imageUrl: string;
    galleryImages: string[];
    requiredFacilities: string[];
    packages: {
        name: string;
        description: string;
        price: number;
        duration: number;
        includedFacilities: string[];
        maxCapacity: number;
        imageUrl?: string;
    }[];
    customFields: {
        name: string;
        type: 'text' | 'number' | 'boolean' | 'select';
        required: boolean;
        options?: string[];
    }[];
    addOnFeatures?: {
        name: string;
        description: string;
        enabled: boolean;
        config?: Record<string, any>;
    }[];
}

const EventTypeForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [formData, setFormData] = useState<EventTypeFormData>({
        category: 'social',
        type: '',
        subType: '',
        description: '',
        imageUrl: '',
        galleryImages: [],
        requiredFacilities: [],
        packages: [{
            name: '',
            description: '',
            price: 0,
            duration: 1,
            includedFacilities: [],
            maxCapacity: 50,
            imageUrl: ''
        }],
        customFields: [],
        addOnFeatures: []
    });

    useEffect(() => {
        if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
            setError('Invalid event type ID');
            setLoading(false);
            return;
        }
        fetchData();
    }, [id]);

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

            const [facilitiesResponse, eventTypeResponse] = await Promise.all([
                axios.get(facilitiesRoute, config),
                id ? axios.get(`${eventTypesRoute}/${id}`, config) : Promise.resolve(null)
            ]);

            if (facilitiesResponse.data.success) {
                setFacilities(facilitiesResponse.data.data);
            }

            if (eventTypeResponse?.data.success) {
                setFormData(eventTypeResponse.data.data);
            } else if (id) {
                setError('Event type not found');
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setError('Event type not found');
            } else if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/organization/login');
            } else {
                setError(error.response?.data?.error || 'Failed to fetch data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (value: 'medical' | 'social' | 'corporate') => {
        setFormData(prev => ({
            ...prev,
            category: value,
            addOnFeatures: getDefaultAddOnFeatures(value)
        }));
    };

    const getDefaultAddOnFeatures = (category: 'medical' | 'social' | 'corporate') => {
        switch (category) {
            case 'medical':
                return [{
                    name: 'doctorSelection',
                    description: 'Select doctor for the meeting',
                    enabled: true,
                    config: {
                        doctors: []
                    }
                }];
            case 'social':
                return [{
                    name: 'guestManagement',
                    description: 'Manage wedding guests',
                    enabled: true,
                    config: {
                        maxGuests: 100,
                        guestCategories: ['Family', 'Friends', 'Colleagues']
                    }
                }];
            case 'corporate':
                return [{
                    name: 'rsvpManagement',
                    description: 'Manage RSVPs for the event',
                    enabled: true,
                    config: {
                        maxAttendees: 50,
                        requireApproval: true
                    }
                }];
            default:
                return [];
        }
    };

    const handlePackageChange = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            packages: prev.packages.map((pkg, i) =>
                i === index ? { ...pkg, [field]: value } : pkg
            )
        }));
    };

    const addPackage = () => {
        setFormData(prev => ({
            ...prev,
            packages: [...prev.packages, {
                name: '',
                description: '',
                price: 0,
                duration: 1,
                includedFacilities: [],
                maxCapacity: 50,
                imageUrl: ''
            }]
        }));
    };

    const removePackage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            packages: prev.packages.filter((_, i) => i !== index)
        }));
    };

    const addGalleryImage = () => {
        setFormData(prev => ({
            ...prev,
            galleryImages: [...prev.galleryImages, '']
        }));
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
        }));
    };

    const updateGalleryImage = (index: number, url: string) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.map((img, i) => i === index ? url : img)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
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

            let response;
            if (id) {
                response = await axios.put(`${eventTypesRoute}/${id}`, formData, config);
            } else {
                response = await axios.post(eventTypesRoute, formData, config);
            }

            if (response.data.success) {
                navigate('/organization/event-types');
            } else {
                setError(response.data.error || 'Failed to save event type');
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/organization/login');
            }
            setError(error.response?.data?.error || 'Failed to save event type');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6">
                    {id ? 'Edit Event Type' : 'Create Event Type'}
                </h2>

                {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="medical">Medical Events</SelectItem>
                                    <SelectItem value="social">Social Events</SelectItem>
                                    <SelectItem value="corporate">Corporate Events</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="type">Event Type</Label>
                            <Input
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="e.g., Wedding, Conference"
                            />
                        </div>

                        <div>
                            <Label htmlFor="subType">Sub Type</Label>
                            <Input
                                id="subType"
                                name="subType"
                                value={formData.subType}
                                onChange={handleChange}
                                placeholder="e.g., Traditional Wedding, Tech Conference"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe this event type..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="imageUrl">Main Image URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                            />
                            {formData.imageUrl && (
                                <div className="mt-2">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Event type preview"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Gallery Images</Label>
                                <Button type="button" onClick={addGalleryImage}>
                                    Add Image
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {formData.galleryImages.map((url, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <Input
                                                value={url}
                                                onChange={(e) => updateGalleryImage(index, e.target.value)}
                                                placeholder="Enter image URL"
                                            />
                                            {url && (
                                                <div className="mt-2">
                                                    <img
                                                        src={url}
                                                        alt={`Gallery image ${index + 1}`}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeGalleryImage(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Required Facilities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {facilities.map(facility => (
                                <div key={facility._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`facility-${facility._id}`}
                                        checked={formData.requiredFacilities.includes(facility._id)}
                                        onCheckedChange={(checked) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                requiredFacilities: checked
                                                    ? [...prev.requiredFacilities, facility._id]
                                                    : prev.requiredFacilities.filter(id => id !== facility._id)
                                            }));
                                        }}
                                    />
                                    <Label htmlFor={`facility-${facility._id}`}>
                                        {facility.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <Label>Packages</Label>
                            <Button type="button" onClick={addPackage}>
                                Add Package
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {formData.packages.map((pkg, index) => (
                                <Card key={index} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Package Name</Label>
                                            <Input
                                                value={pkg.name}
                                                onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                                                placeholder="e.g., Basic Package"
                                            />
                                        </div>

                                        <div>
                                            <Label>Price (₹)</Label>
                                            <Input
                                                type="number"
                                                value={pkg.price}
                                                onChange={(e) => handlePackageChange(index, 'price', Number(e.target.value))}
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <Label>Duration (hours)</Label>
                                            <Input
                                                type="number"
                                                value={pkg.duration}
                                                onChange={(e) => handlePackageChange(index, 'duration', Number(e.target.value))}
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <Label>Max Capacity</Label>
                                            <Input
                                                type="number"
                                                value={pkg.maxCapacity}
                                                onChange={(e) => handlePackageChange(index, 'maxCapacity', Number(e.target.value))}
                                                min="1"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={pkg.description}
                                                onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                                                placeholder="Describe this package..."
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Package Image URL</Label>
                                            <Input
                                                value={pkg.imageUrl}
                                                onChange={(e) => handlePackageChange(index, 'imageUrl', e.target.value)}
                                                placeholder="Enter package image URL"
                                            />
                                            {pkg.imageUrl && (
                                                <div className="mt-2">
                                                    <img
                                                        src={pkg.imageUrl}
                                                        alt={`Package ${index + 1} preview`}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Included Facilities</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                                {facilities.map(facility => (
                                                    <div key={facility._id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`package-${index}-facility-${facility._id}`}
                                                            checked={pkg.includedFacilities.includes(facility._id)}
                                                            onCheckedChange={(checked) => {
                                                                handlePackageChange(
                                                                    index,
                                                                    'includedFacilities',
                                                                    checked
                                                                        ? [...pkg.includedFacilities, facility._id]
                                                                        : pkg.includedFacilities.filter(id => id !== facility._id)
                                                                );
                                                            }}
                                                        />
                                                        <Label htmlFor={`package-${index}-facility-${facility._id}`}>
                                                            {facility.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {formData.packages.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="mt-4"
                                            onClick={() => removePackage(index)}
                                        >
                                            Remove Package
                                        </Button>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/organization/event-types')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? <LoadingSpinner /> : (id ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EventTypeForm; 