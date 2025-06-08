import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { facilitiesRoute, organization } from '../../constants';
import { Facility } from '../../types/event';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { getFacilityCategories, FacilityCategory } from '../../constants/facilityCategories';

interface FacilityFormData {
    name: string;
    description: string;
    price: number;
    priceUnit: 'hour' | 'day' | 'event';
    category: string;
    isAvailable: boolean;
    imageUrl: string;
    organization?: string; // Optional since we don't need to send it to the backend
}

const defaultFormData: FacilityFormData = {
    name: '',
    description: '',
    price: 0,
    priceUnit: 'hour',
    category: '',
    isAvailable: true,
    imageUrl: ''
};

const FacilityManagement: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [formData, setFormData] = useState<FacilityFormData>(defaultFormData);
    const [saving, setSaving] = useState(false);
    const [organizationType, setOrganizationType] = useState<string>('');
    const [loadingOrgType, setLoadingOrgType] = useState(true);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                await fetchOrganizationType();
                await fetchFacilities();
            } catch (err) {
                console.error('Error initializing data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        initializeData();
    }, []);

    const fetchOrganizationType = async () => {
        try {
            setLoadingOrgType(true);
            const response = await axios.get(organization, getAuthConfig());
            const orgType = response.data.data[0].type; // Access the first organization's type
            console.log('Organization Type:', orgType); // Debug log
            setOrganizationType(orgType);

            // Set default category if available
            const categories = getFacilityCategories(orgType);
            // console.log('Available categories for', orgType, ':', categories); // Debug log
            if (categories.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    category: categories[0].value
                }));
            }
        } catch (err) {
            console.error('Error fetching organization type:', err);
            setError('Failed to fetch organization type');
        } finally {
            setLoadingOrgType(false);
        }
    };

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Configure axios with auth header
    const getAuthConfig = () => {
        return {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        };
    };

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(facilitiesRoute, getAuthConfig());
            setFacilities(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch facilities');
            console.error('Error fetching facilities:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Remove organization field from the request data
            const { organization, ...facilityData } = formData;

            if (editingFacility) {
                await axios.put(
                    `${facilitiesRoute}/${editingFacility._id}`,
                    facilityData,
                    getAuthConfig()
                );
            } else {
                await axios.post(facilitiesRoute, facilityData, getAuthConfig());
            }

            await fetchFacilities();
            setIsDialogOpen(false);
            setFormData(defaultFormData);
            setEditingFacility(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save facility');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (facility: Facility) => {
        setEditingFacility(facility);
        setFormData({
            name: facility.name,
            description: facility.description,
            price: facility.price,
            priceUnit: facility.priceUnit,
            category: facility.category,
            isAvailable: facility.isAvailable,
            imageUrl: facility.imageUrl || ''
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (facilityId: string) => {
        if (!window.confirm('Are you sure you want to delete this facility?')) return;

        try {
            await axios.delete(
                `${facilitiesRoute}/${facilityId}`,
                getAuthConfig()
            );
            await fetchFacilities();
        } catch (err) {
            setError('Failed to delete facility');
            console.error('Error deleting facility:', err);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setFormData(defaultFormData);
        setEditingFacility(null);
    };

    const getAvailableCategories = (): FacilityCategory[] => {
        if (!organizationType) {
            console.log('No organization type available'); // Debug log
            return [];
        }
        const categories = getFacilityCategories(organizationType);
        // console.log('Getting categories for', organizationType, ':', categories); // Debug log
        return categories;
    };

    const handleDialogOpen = () => {
        if (!organizationType) {
            setError('Please wait while loading organization data');
            return;
        }
        // Reset form data and editing state when opening for new facility
        setFormData(defaultFormData);
        setEditingFacility(null);
        setIsDialogOpen(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Facilities</h1>
                    <p className="text-gray-600">Manage your facilities and add-ons</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleDialogOpen}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Facility
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                            </DialogTitle>
                        </DialogHeader>
                        {loadingOrgType ? (
                            <div className="flex justify-center p-4">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="priceUnit">Price Unit</Label>
                                        <Select
                                            value={formData.priceUnit}
                                            onValueChange={(value: 'hour' | 'day' | 'event') =>
                                                setFormData(prev => ({ ...prev, priceUnit: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hour">Per Hour</SelectItem>
                                                <SelectItem value="day">Per Day</SelectItem>
                                                <SelectItem value="event">Per Event</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value: string) =>
                                                setFormData(prev => ({ ...prev, category: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableCategories().map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {formData.category && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {getAvailableCategories().find(c => c.value === formData.category)?.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="imageUrl">Image URL</Label>
                                        <Input
                                            id="imageUrl"
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {formData.imageUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Facility preview"
                                                    className="h-32 w-32 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.currentTarget.src = ''; // Clear invalid image
                                                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="isAvailable"
                                                checked={formData.isAvailable}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <Label htmlFor="isAvailable">Available for booking</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            setFormData(defaultFormData);
                                            setEditingFacility(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={saving}>
                                        {saving ? <LoadingSpinner /> : (editingFacility ? 'Save Changes' : 'Add Facility')}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    {error}
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility) => (
                    <Card key={facility._id} className="overflow-hidden">
                        <div className="relative h-48 w-full">
                            {facility.imageUrl ? (
                                <img
                                    src={facility.imageUrl}
                                    alt={facility.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold">{facility.name}</h3>
                                    <p className="text-sm text-gray-500">{facility.category}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(facility)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(facility._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{facility.description}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-medium">
                                    ₹{facility.price}/{facility.priceUnit}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs ${facility.isAvailable
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {facility.isAvailable ? 'Available' : 'Unavailable'}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FacilityManagement; 