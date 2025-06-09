import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarClock, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [userType, setUserType] = useState<'user' | 'organization' | null>(null);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Determine user type based on current route path
        const path = location.pathname;
        if (path.startsWith('/user/')) {
            setUserType('user');
            // Check for user token
            const userToken = localStorage.getItem('userToken');
            setHasToken(!!userToken);
        } else if (path.startsWith('/organization/')) {
            setUserType('organization');
            // Check for organization token
            const orgToken = localStorage.getItem('token');
            setHasToken(!!orgToken);
        } else {
            setUserType(null);
            setHasToken(false);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        if (userType === 'user') {
            localStorage.removeItem('userToken');
        } else if (userType === 'organization') {
            localStorage.removeItem('token');
        }
        setUserType(null);
        setHasToken(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const renderNavLinks = () => {
        if (!userType || !hasToken) return null;

        if (userType === 'user') {
            return (
                <>
                    <Link to="/user/events" className="text-gray-700 hover:text-blue-brand font-medium">Events</Link>
                    <Link to="/user/favorites" className="text-gray-700 hover:text-blue-brand font-medium">Favorites</Link>
                    <Link to="/user/profile" className="text-gray-700 hover:text-blue-brand font-medium">Profile</Link>
                </>
            );
        }

        if (userType === 'organization') {
            return (
                <>
                    <Link to="/organization/dashboard" className="text-gray-700 hover:text-blue-brand font-medium">Dashboard</Link>
                    <Link to="/organization/event-types" className="text-gray-700 hover:text-blue-brand font-medium">Event Types</Link>
                    <Link to="/organization/facilities" className="text-gray-700 hover:text-blue-brand font-medium">Facilities</Link>
                </>
            );
        }

        return null;
    };

    const renderMobileNavLinks = () => {
        if (!userType || !hasToken) return null;

        if (userType === 'user') {
            return (
                <>
                    <Link to="/user/events" className="text-gray-700 hover:text-blue-brand font-medium py-2">Events</Link>
                    <Link to="/user/favorites" className="text-gray-700 hover:text-blue-brand font-medium py-2">Favorites</Link>
                    <Link to="/user/profile" className="text-gray-700 hover:text-blue-brand font-medium py-2">Profile</Link>
                </>
            );
        }

        if (userType === 'organization') {
            return (
                <>
                    <Link to="/organization/dashboard" className="text-gray-700 hover:text-blue-brand font-medium py-2">Dashboard</Link>
                    <Link to="/organization/event-types" className="text-gray-700 hover:text-blue-brand font-medium py-2">Event Types</Link>
                    <Link to="/organization/facilities" className="text-gray-700 hover:text-blue-brand font-medium py-2">Facilities</Link>
                </>
            );
        }

        return null;
    };

    return (
        <div className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <CalendarClock className="h-8 w-8 text-blue-brand mr-2" />
                        <span className="text-xl font-bold text-blue-brand">Event Scheduler</span>
                    </Link>
                </div>

                <nav className="hidden md:flex space-x-6">
                    {renderNavLinks()}
                </nav>

                <div className="hidden md:flex space-x-4">
                    {userType && hasToken ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-gray-700 hover:text-blue-brand"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    ) : (
                        <div className='flex flex-row gap-4'>
                            <Link to='/user/login'>
                                <Button variant="outline" className="border-blue-brand text-blue-brand hover:bg-blue-brand hover:text-white w-full">
                                    User
                                </Button>
                            </Link>
                            <Link to="/organization/login">
                                <Button className="bg-blue-brand hover:bg-blue-700 text-white w-full">
                                    Organization
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </Button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white absolute w-full shadow-md animate-fade-in">
                    <div className="flex flex-col px-4 py-4 space-y-3">
                        {renderMobileNavLinks()}
                        <div className="flex flex-col space-y-2 pt-2">
                            {userType && hasToken ? (
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-blue-brand justify-start"
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Logout
                                </Button>
                            ) : (
                                <div className='flex flex-row gap-4'>
                                    <Link to='/user/login'>
                                        <Button variant="outline" className="border-blue-brand text-blue-brand hover:bg-blue-brand hover:text-white w-full">
                                            User
                                        </Button>
                                    </Link>
                                    <Link to="/organization/login">
                                        <Button className="bg-blue-brand hover:bg-blue-700 text-white w-full">
                                            Organization
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
