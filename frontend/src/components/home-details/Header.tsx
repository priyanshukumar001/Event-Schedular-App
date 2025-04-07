import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarClock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Profile from '../profile';
import { useVerify } from '../../../config/globalVariables';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <CalendarClock className="h-8 w-8 text-blue-brand mr-2" />
                    <span className="text-xl font-bold text-blue-brand">Events Scheduler</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <a href="#" className="text-gray-700 hover:text-blue-brand font-medium">Home</a>
                    <a href="#" className="text-gray-700 hover:text-blue-brand font-medium">Features</a>
                    <a href="#" className="text-gray-700 hover:text-blue-brand font-medium">Pricing</a>
                    <a href="#" className="text-gray-700 hover:text-blue-brand font-medium">Contact</a>
                </nav>

                <div className="hidden md:flex space-x-4">
                    {
                        (isVerified) ? (<Profile />) : (
                            <div className='flex flex-row gap-4'>
                                <Link to='/user/login'>
                                    <Button variant="outline" className="border-blue-brand text-blue-brand hover:bg-blue-brand hover:text-white w-full">
                                        User
                                    </Button>
                                </Link>
                                <Link to="/admin/login">
                                    <Button className="bg-blue-brand hover:bg-blue-700 text-white w-full">
                                        Admin
                                    </Button>
                                </Link>
                            </div>
                        )
                    }
                </div>

                {/* Mobile menu button */}
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

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white absolute w-full shadow-md animate-fade-in">
                    <div className="flex flex-col px-4 py-4 space-y-3">
                        <a href="#" className="text-gray-700 hover:text-blue-brand font-medium py-2">Home</a>
                        <a href="#" className="text-gray-700 hover:text-blue-brand font-medium py-2">Features</a>
                        <a href="#" className="text-gray-700 hover:text-blue-brand font-medium py-2">Pricing</a>
                        <a href="#" className="text-gray-700 hover:text-blue-brand font-medium py-2">Contact</a>
                        <div className="flex flex-col space-y-2 pt-2">
                            {
                                (isVerified) ? (<Profile />) : (
                                    <div className='flex flex-row gap-4'>
                                        <Link to='/user/login'>
                                            <Button variant="outline" className="border-blue-brand text-blue-brand hover:bg-blue-brand hover:text-white w-full">
                                                User
                                            </Button>
                                        </Link>
                                        <Link to="/admin/login">
                                            <Button className="bg-blue-brand hover:bg-blue-700 text-white w-full">
                                                Admin
                                            </Button>
                                        </Link>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
