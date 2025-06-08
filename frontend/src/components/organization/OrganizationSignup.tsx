import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import axios from 'axios';
import { organization } from '../../constants';

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface Contact {
    name: string;
    email: string;
    phone: string;
    address: Address;
}

interface OrganizationFormData {
    name: string;
    type: string;
    contact: Contact;
    gstNumber?: string;
    password: string;
    confirmPassword: string;
}

const organizationTypes = [
    'Hotel',
    'Restaurant',
    'Conference Center',
    'Wedding Venue',
    'Event Space',
    'Hospital',
    'Clinic',
    'Medical Center',
    'Other'
];

const OrganizationSignup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<OrganizationFormData>({
        name: '',
        type: '',
        contact: {
            name: '',
            email: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                country: '',
                zipCode: ''
            }
        },
        gstNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('contact.')) {
            const field = name.split('.')[1];
            if (field === 'address') {
                const addressField = name.split('.')[2];
                setFormData(prev => ({
                    ...prev,
                    contact: {
                        ...prev.contact,
                        address: {
                            ...prev.contact.address,
                            [addressField]: value
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    contact: {
                        ...prev.contact,
                        [field]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            type: value
        }));
    };

    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter');
            return false;
        }

        if (!/[a-z]/.test(password)) {
            setPasswordError('Password must contain at least one lowercase letter');
            return false;
        }

        if (!/[0-9]/.test(password)) {
            setPasswordError('Password must contain at least one number');
            return false;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError('Password must contain at least one special character');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPasswordError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!validatePassword(formData.password)) {
            setLoading(false);
            return;
        }

        if (!organizationTypes.includes(formData.type)) {
            setError('Please select a valid organization type');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...dataToSubmit } = formData;
            const response = await axios.post(`${organization}/register`, dataToSubmit);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/organization/dashboard');
            } else {
                setError(response.data.error || 'Failed to register organization');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register organization');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl w-full space-y-8 p-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Organization Registration
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Organization Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="type">Organization Type</Label>
                            <Select value={formData.type} onValueChange={handleTypeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizationTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-500 mt-1">
                                Select the type that best describes your organization. This will determine what types of events you can host.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="contact.name">Contact Person Name</Label>
                            <Input
                                id="contact.name"
                                name="contact.name"
                                type="text"
                                required
                                value={formData.contact.name}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="contact.email">Email address</Label>
                            <Input
                                id="contact.email"
                                name="contact.email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.contact.email}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="contact.phone">Phone number</Label>
                            <Input
                                id="contact.phone"
                                name="contact.phone"
                                type="tel"
                                required
                                value={formData.contact.phone}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="contact.address.street">Street Address</Label>
                            <Input
                                id="contact.address.street"
                                name="contact.address.street"
                                type="text"
                                required
                                value={formData.contact.address.street}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="contact.address.city">City</Label>
                                <Input
                                    id="contact.address.city"
                                    name="contact.address.city"
                                    type="text"
                                    required
                                    value={formData.contact.address.city}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="contact.address.state">State</Label>
                                <Input
                                    id="contact.address.state"
                                    name="contact.address.state"
                                    type="text"
                                    required
                                    value={formData.contact.address.state}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="contact.address.zipCode">ZIP Code</Label>
                                <Input
                                    id="contact.address.zipCode"
                                    name="contact.address.zipCode"
                                    type="text"
                                    required
                                    value={formData.contact.address.zipCode}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="contact.address.country">Country</Label>
                                <Input
                                    id="contact.address.country"
                                    name="contact.address.country"
                                    type="text"
                                    required
                                    value={formData.contact.address.country}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                            <Input
                                id="gstNumber"
                                name="gstNumber"
                                type="text"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1"
                            />
                            {passwordError && (
                                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>
                    </div>


                    {error && (
                        <Alert variant="destructive" className='bg-red-100 text-red-800'>
                            {error}
                        </Alert>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : 'Register Organization'}
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    );
};

export default OrganizationSignup; 