import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, MessageSquare, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="py-16 md:py-24 px-4">
            <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6 md:pr-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                        Effortlessly Schedule Events with
                        <span className="text-blue-brand"> Event Scheduler</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Streamline your scheduling process. Connect admins and users with an intuitive platform for managing events, availability, and communication.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/admin/signup">
                            <Button className="bg-blue-brand hover:bg-blue-700 text-white text-lg px-8 py-6">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/admin/login">
                            <Button variant="outline" className="border-blue-brand text-blue-brand hover:bg-blue-50 text-lg px-8 py-6">
                                See Demo
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-8 relative overflow-hidden shadow-lg animate-fade-in">
                    <div className="absolute -right-20 -top-20 h-40 w-40 bg-blue-brand/20 rounded-full"></div>
                    <div className="absolute -left-20 -bottom-20 h-40 w-40 bg-blue-brand/20 rounded-full"></div>
                    <div className="relative bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Team Meeting</h3>
                            <span className="bg-blue-100 text-blue-brand px-3 py-1 rounded-full text-sm">Confirmed</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-blue-brand" />
                            <span>April 10, 2025 • 10:00 - 11:00 AM</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="h-5 w-5 mr-2 text-blue-brand" />
                            <span>5 Participants</span>
                        </div>
                    </div>
                    <div className="relative bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Client Presentation</h3>
                            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm">Pending</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-blue-brand" />
                            <span>April 15, 2025 • 2:00 - 3:00 PM</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="h-5 w-5 mr-2 text-blue-brand" />
                            <span>3 Participants</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
