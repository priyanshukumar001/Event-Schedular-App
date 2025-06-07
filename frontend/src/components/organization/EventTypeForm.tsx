import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { organization } from '../../constants';

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
    facilities: string[];
}

interface EventType {
    type: string;
    subType: string;
    requiredFields: string[];
    packages: Package[];
}

const EventTypeForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [formData, setFormData] = useState<EventType>({
        type: '',
        subType: '',
        requiredFields: [],
        packages: [{
            name: '',
            description: '',
            price: 0,
            duration: 0,
            facilities: []
        }]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch organization's facilities
                const facilitiesResponse = await axios.get(`${organization}/facilities`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setFacilities(facilitiesResponse.data.data);

                // If editing, fetch event type data
                if (id) {
                    const response = await axios.get(`${organization}/event-types/${id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setFormData(response.data.data);
                }
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
        const { name, value } = e.target;
        if (index !== undefined) {
            setFormData(prev => ({
                ...prev,
                packages: prev.packages.map((pkg, i) =>
                    i === index ? { ...pkg, [name]: value } : pkg
                )
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFacilityChange = (packageIndex: number, facilityId: string) => {
        setFormData(prev => ({
            ...prev,
            packages: prev.packages.map((pkg, i) => {
                if (i === packageIndex) {
                    const facilities = pkg.facilities.includes(facilityId)
                        ? pkg.facilities.filter(id => id !== facilityId)
                        : [...pkg.facilities, facilityId];
                    return { ...pkg, facilities };
                }
                return pkg;
            })
        }));
    };

    const addPackage = () => {
        setFormData(prev => ({
            ...prev,
            packages: [...prev.packages, {
                name: '',
                description: '',
                price: 0,
                duration: 0,
                facilities: []
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
        setLoading(true);
        setError(null);

        try {
            const url = id
                ? `${organization}/event-types/${id}`
                : `${organization}/event-types`;

            const method = id ? 'put' : 'post';

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            navigate('/organization/event-types');
        } catch (err) {
            setError('Failed to save event type');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
                {id ? 'Edit Event Type' : 'Create Event Type'}
            </h2>

            {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="type">Event Type</Label>
                        <Input
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="subType">Sub Type</Label>
                        <Input
                            id="subType"
                            name="subType"
                            value={formData.subType}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Packages</h3>
                        {formData.packages.map((pkg, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-md font-medium">Package {index + 1}</h4>
                                    {formData.packages.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removePackage(index)}
                                        >
                                            Remove Package
                                        </Button>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor={`package-name-${index}`}>Name</Label>
                                    <Input
                                        id={`package-name-${index}`}
                                        name="name"
                                        value={pkg.name}
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`package-description-${index}`}>Description</Label>
                                    <Input
                                        id={`package-description-${index}`}
                                        name="description"
                                        value={pkg.description}
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`package-price-${index}`}>Price</Label>
                                        <Input
                                            id={`package-price-${index}`}
                                            name="price"
                                            type="number"
                                            value={pkg.price}
                                            onChange={(e) => handleChange(e, index)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`package-duration-${index}`}>Duration (hours)</Label>
                                        <Input
                                            id={`package-duration-${index}`}
                                            name="duration"
                                            type="number"
                                            value={pkg.duration}
                                            onChange={(e) => handleChange(e, index)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Available Facilities</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {facilities.map(facility => (
                                            <div key={facility._id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`facility-${facility._id}-${index}`}
                                                    checked={pkg.facilities.includes(facility._id)}
                                                    onChange={() => handleFacilityChange(index, facility._id)}
                                                    className="rounded border-gray-300"
                                                />
                                                <label htmlFor={`facility-${facility._id}-${index}`}>
                                                    {facility.name} (₹{facility.price})
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={addPackage}
                            className="mt-4"
                        >
                            Add Package
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/organization/event-types')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Save Event Type'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default EventTypeForm; 