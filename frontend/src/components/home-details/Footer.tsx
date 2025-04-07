import React from 'react';
import { CalendarClock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <CalendarClock className="h-8 w-8 text-blue-brand mr-2" />
                            <span className="text-xl font-bold text-white">Events Scheduler</span>
                        </div>
                        <p className="text-gray-400">
                            Streamlining event scheduling between admins and users with an intuitive platform.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-blue-brand">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742A13.84 13.84 0 0 0 22 4.009z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-blue-brand">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16.5 12.5a5 5 0 10-5 5 5 5 0 005-5zm-1.86-7.55h-6.27a5.1 5.1 0 00-5.1 5.1v6.27a5.1 5.1 0 005.1 5.1h6.27a5.1 5.1 0 005.1-5.1v-6.27a5.1 5.1 0 00-5.1-5.1zm3.1 11.37a3.1 3.1 0 01-3.1 3.1h-6.27a3.1 3.1 0 01-3.1-3.1v-6.27a3.1 3.1 0 013.1-3.1h6.27a3.1 3.1 0 013.1 3.1z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-blue-brand">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8H6v12h3v-12zm-1.5-2a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm15 2h-2.74l-2.5 6.87L15 8h-3v12h3v-7l3 7h2l3-7v7h3V8h-2.5z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Enterprise</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Guides</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-brand transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-blue-brand transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400 text-center">
                    <p>© {new Date().getFullYear()} ScheduleFlow. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
