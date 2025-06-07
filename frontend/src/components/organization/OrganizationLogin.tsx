import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import LoadingSpinner from '../ui/loadingSpinner';
import { organization } from '../../constants';

interface LoginFormData {
    email: string;
    password: string;
}

interface ValidationErrors {
    email?: string;
    password?: string;
}

const OrganizationLogin: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        let isValid = true;

        // Validate email
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Invalid email format';
                isValid = false;
            }
        }

        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error when user starts typing
        if (validationErrors[name as keyof ValidationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${organization}/login`, formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                // Store organization data if needed
                localStorage.setItem('organization', JSON.stringify(response.data.organization));
                navigate('/organization/dashboard');
            } else {
                setError(response.data.error || 'Failed to login');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full space-y-8 p-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Organization Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to manage your organization
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        {error}
                    </Alert>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 ${validationErrors.email ? 'border-red-500' : ''}`}
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-1 ${validationErrors.password ? 'border-red-500' : ''}`}
                            />
                            {validationErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : 'Sign in'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Button
                                variant="link"
                                onClick={() => navigate('/organization/signup')}
                                className="text-primary hover:text-primary/80"
                            >
                                Register your organization
                            </Button>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default OrganizationLogin; 