import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { eventTypesRoute, facilitiesRoute, organization } from '../../constants';
import { EventType, Facility } from '../../types/event';
import { EVENT_TYPE_OPTIONS, EVENT_SUBTYPE_OPTIONS } from '../../constants/eventOptions';
import { Textarea } from '../ui/textarea';
import { ORGANIZATION_EVENT_MAPPING } from '../../constants/organizationEventMapping';
import { EventTypeFormData } from '../../types/event';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    getEventCategories,
    getSubCategories,
    getSubSubCategories,
    isValidEventCategoryForOrganization
} from '../../constants/eventCategories';

const defaultPackage = {
    name: '',
    description: '',
    price: 0,
    duration: 1,
    includedFacilities: [],
    maxCapacity: 1,
    imageUrl: ''
};

const EventTypeForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [organizationType, setOrganizationType] = useState<string>('');
    const [formData, setFormData] = useState<EventTypeFormData>({
        category: '',
        type: '',
        subType: '',
        description: '',
        imageUrl: '',
        galleryImages: [],
        requiredFacilities: [],
        packages: [{ ...defaultPackage }],
        customFields: [],
        addOnFeatures: []
    });

    // Get allowed categories based on organization type
    const getAllowedCategories = () => {
        return ORGANIZATION_EVENT_MAPPING[organizationType] || [];
    };

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
                // If editing, check if the event type category is allowed for this organization
                if (id) {
                    const eventTypeResponse = await axios.get(`${eventTypesRoute}/${id}`, config);
                    if (eventTypeResponse.data.success) {
                        const data = eventTypeResponse.data.data;
                        const allowedCategories = ORGANIZATION_EVENT_MAPPING[orgResponse.data.data.type] || [];
                        if (!allowedCategories.includes(data.category)) {
                            setError('You are not authorized to edit this event type');
                            setLoading(false);
                            return;
                        }
                        // Ensure all required fields are present
                        setFormData({
                            category: data.category || '',
                            type: data.type || '',
                            subType: data.subType || '',
                            description: data.description || '',
                            imageUrl: data.imageUrl || '',
                            galleryImages: data.galleryImages || [],
                            requiredFacilities: data.requiredFacilities || [],
                            packages: data.packages?.length ? data.packages : [{ ...defaultPackage }],
                            customFields: data.customFields || [],
                            addOnFeatures: data.addOnFeatures || []
                        });
                    }
                }
            }

            // Fetch facilities
            const facilitiesResponse = await axios.get(facilitiesRoute, config);
            if (facilitiesResponse.data.success) {
                setFacilities(facilitiesResponse.data.data);
            }

            setLoading(false);
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/organization/login');
            }
            setError(error.response?.data?.error || 'Failed to fetch data');
            setLoading(false);
        }
    };

    const handleCategoryChange = (category: string) => {
        // Check if the category is allowed for this organization
        if (!isValidEventCategoryForOrganization(organizationType, category)) {
            setError('This category is not allowed for your organization type');
            return;
        }
        setFormData(prev => ({
            ...prev,
            category,
            type: '',
            subType: '',
            addOnFeatures: []
        }));
    };

    const handleTypeChange = (type: string) => {
        setFormData(prev => ({
            ...prev,
            type,
            subType: '',
            addOnFeatures: []
        }));
    };

    const handleSubTypeChange = (subType: string) => {
        setFormData(prev => ({
            ...prev,
            subType,
            addOnFeatures: []
        }));
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
            packages: [...prev.packages, { ...defaultPackage }]
        }));
    };

    const removePackage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            packages: prev.packages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.category || !formData.type || !formData.subType || !formData.description || !formData.imageUrl) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate packages
        if (formData.packages.length === 0) {
            setError('At least one package is required');
            return;
        }

        for (const pkg of formData.packages) {
            if (!pkg.name || !pkg.description || pkg.price <= 0 || pkg.duration <= 0 || pkg.maxCapacity <= 0) {
                setError('Please fill in all required package fields');
                return;
            }
        }

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
                        {/* Category Selection */}
                        <div>
                            <Label>Event Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getEventCategories()
                                        .filter(cat => isValidEventCategoryForOrganization(organizationType, cat.value))
                                        .map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {formData.category && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {getEventCategories().find(cat => cat.value === formData.category)?.description}
                                </p>
                            )}
                        </div>

                        {/* Type Selection */}
                        {formData.category && (
                            <div>
                                <Label>Event Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={handleTypeChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getSubCategories(formData.category).map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formData.type && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {getSubCategories(formData.category)
                                            .find(type => type.value === formData.type)?.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Subtype Selection */}
                        {formData.type && (
                            <div>
                                <Label>Event Subtype</Label>
                                <Select
                                    value={formData.subType}
                                    onValueChange={handleSubTypeChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subtype" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getSubSubCategories(formData.category, formData.type).map((subType) => (
                                            <SelectItem key={subType.value} value={subType.value}>
                                                {subType.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formData.subType && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {getSubSubCategories(formData.category, formData.type)
                                            .find(subType => subType.value === formData.subType)?.description}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe this event type..."
                            />
                        </div>

                        <div>
                            <Label htmlFor="imageUrl">Main Image URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
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
                                <Button type="button" onClick={() => setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ''] }))}>
                                    Add Image
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {formData.galleryImages.map((url, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <Input
                                                value={url}
                                                onChange={(e) => {
                                                    const newImages = [...formData.galleryImages];
                                                    newImages[index] = e.target.value;
                                                    setFormData(prev => ({ ...prev, galleryImages: newImages }));
                                                }}
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
                                            onClick={() => {
                                                const newImages = formData.galleryImages.filter((_, i) => i !== index);
                                                setFormData(prev => ({ ...prev, galleryImages: newImages }));
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <Label>Required Facilities</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                {facilities.map(facility => (
                                    <div key={facility._id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`facility-${facility._id}`}
                                            checked={formData.requiredFacilities.includes(facility._id)}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    requiredFacilities: e.target.checked
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

                        <div className="md:col-span-2">
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

                                            <div>
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

                                            <div>
                                                <Label>Included Facilities</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                                    {facilities.map(facility => (
                                                        <div key={facility._id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`package-${index}-facility-${facility._id}`}
                                                                checked={pkg.includedFacilities.includes(facility._id)}
                                                                onChange={(e) => {
                                                                    handlePackageChange(
                                                                        index,
                                                                        'includedFacilities',
                                                                        e.target.checked
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
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EventTypeForm; 