import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import { Label } from '../ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Eye, EyeOff, User, Mail, Phone, Camera } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePhotoUrl: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                profilePhotoUrl: user.profilePhotoUrl || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const result = await updateProfile(formData);
        if (result.success) {
            setSuccess('Profile updated successfully');
            setEditing(false);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        if (result.success) {
            setSuccess('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    if (!user) {
        return null;
    }

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="container max-w-2xl mx-auto p-4">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Profile</h1>
                    {!editing && (
                        <Button
                            onClick={() => setEditing(true)}
                            variant="outline"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-4">
                        {success}
                    </Alert>
                )}

                <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage
                            src={formData.profilePhotoUrl}
                            alt={formData.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {getInitials(formData.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">{formData.name}</h2>
                        <p className="text-gray-500">{formData.email}</p>
                    </div>
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                disabled
                            />
                            <p className="text-sm text-gray-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="profilePhotoUrl"
                                    name="profilePhotoUrl"
                                    type="url"
                                    value={formData.profilePhotoUrl}
                                    onChange={handleChange}
                                    placeholder="Enter a URL for your profile photo"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const url = prompt('Enter image URL:');
                                        if (url) {
                                            setFormData(prev => ({
                                                ...prev,
                                                profilePhotoUrl: url
                                            }));
                                        }
                                    }}
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500">Enter a valid image URL</p>
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditing(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-gray-500" />
                            <span>{formData.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <span>{formData.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-gray-500" />
                            <span>{formData.phone || 'Not provided'}</span>
                        </div>
                    </div>
                )}

                <Separator className="my-6" />

                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm your new password"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Profile; 