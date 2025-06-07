import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { organization } from '../../constants';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../ui/loadingSpinner';

interface Package {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    includedFacilities: string[];
}

interface EventType {
    _id: string;
    type: string;
    subType: string;
    requiredFields: string[];
    packages: Package[];
}

interface EventTypeFormData {
    type: string;
    subType: string;
    requiredFields: string[];
    packages: {
        name: string;
        description: string;
        price: number;
        duration: number;
        includedFacilities: string[];
    }[];
}

const EventTypeManagement: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<EventTypeFormData>({
        type: '',
        subType: '',
        requiredFields: [],
        packages: [{
            name: '',
            description: '',
            price: 0,
            duration: 1,
            includedFacilities: []
        }]
    });

    useEffect(() => {
        fetchEventTypes();
    }, []);

    const fetchEventTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${organization}/event-types`);
            setEventTypes(response.data.data);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch event types');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this event type?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${organization}/event-types/${id}`);
            setEventTypes(prev => prev.filter(type => type._id !== id));
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to delete event type');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePackageChange = (index: number, field: keyof Package, value: string | number) => {
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
                includedFacilities: []
            }]
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
        try {
            await axios.post(`${organization}/event-types`, formData);
            setShowForm(false);
            fetchEventTypes();
            setFormData({
                type: '',
                subType: '',
                requiredFields: [],
                packages: [{
                    name: '',
                    description: '',
                    price: 0,
                    duration: 1,
                    includedFacilities: []
                }]
            });
        } catch (err: any) {
            setError('Failed to create event type');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Event Types</h2>
                <Button onClick={() => navigate('/organization/event-types/new')}>
                    Add New Event Type
                </Button>
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            {eventTypes.length === 0 ? (
                <Card className="p-6 text-center">
                    <p className="text-gray-500">No event types found. Add your first event type to get started.</p>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {eventTypes.map(eventType => (
                        <Card key={eventType._id} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{eventType.type}</h3>
                                    <p className="text-sm text-gray-500">{eventType.subType}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Packages</h4>
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
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(eventType._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventTypeManagement; 