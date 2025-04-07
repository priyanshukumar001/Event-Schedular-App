import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserGroupIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface EventItem {
    id: string;
    title: string;
    date: string;
    time: string;
    organizer: string;
}

export default function HomeDetailed() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [upcomingEvents] = useState<EventItem[]>([
        {
            id: '1',
            title: 'Project Kickoff Meeting',
            date: '2024-03-20',
            time: '14:00 - 15:30',
            organizer: 'John Doe'
        },
        {
            id: '2',
            title: 'Client Workshop',
            date: '2024-03-22',
            time: '10:00 - 12:00',
            organizer: 'Jane Smith'
        }
    ]);

    return (
        <div className="min-h-screen bg-white border-2">
            {/* Navigation Bar */}
            {/* <nav className="bg-[#0073e6] p-4 text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold">EventScheduler</h1>
                    <div className="flex items-center space-x-6">
                        <button className="hover:text-blue-200">Dashboard</button>
                        <button className="hover:text-blue-200">Schedule</button>
                        <button className="hover:text-blue-200">Notifications <BellIcon className="h-5 w-5 inline-block ml-1" /></button>
                        <button className="bg-white text-[#0073e6] px-4 py-2 rounded-lg hover:bg-blue-50">
                            Login/Signup
                        </button>
                    </div>
                </div>
            </nav> */}

            {/* Hero Section */}
            <div className="bg-[#0073e6] text-white py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Simplify Your Event Scheduling</h2>
                    <p className="text-xl mb-8">Easily manage meetings, events, and appointments with real-time coordination</p>
                    <Link to="/admin/login">
                        <button
                            className="bg-white text-[#0073e6] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50">
                            Schedule New Event
                        </button>

                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-6 text-[#0073e6]">
                            <CalendarIcon className="h-6 w-6 inline-block mr-2" />
                            Availability Calendar
                        </h3>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {/* Calendar Days - Simplified example */}
                            {[...Array(31)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`p-2 text-center rounded ${i === 14 ? 'bg-[#0073e6] text-white' : 'hover:bg-blue-50'}`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-6 text-[#0073e6]">
                            <ClockIcon className="h-6 w-6 inline-block mr-2" />
                            Upcoming Events
                        </h3>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="p-4 border rounded-lg hover:bg-blue-50">
                                    <div className="font-semibold text-[#0073e6]">{event.title}</div>
                                    <div className="text-sm text-gray-600">{event.date} | {event.time}</div>
                                    <div className="text-sm">Organizer: {event.organizer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                        <UserGroupIcon className="h-8 w-8 text-[#0073e6] mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Team Scheduling</h4>
                        <p className="text-gray-600">Coordinate across teams with smart availability suggestions</p>
                    </div>
                    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                        <ChartBarIcon className="h-8 w-8 text-[#0073e6] mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Real-time Analytics</h4>
                        <p className="text-gray-600">Track event metrics and participation statistics</p>
                    </div>
                    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                        <BellIcon className="h-8 w-8 text-[#0073e6] mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Automated Reminders</h4>
                        <p className="text-gray-600">Reduce no-shows with email & SMS notifications</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
                    <div className="bg-[#0073e6] text-white p-6 rounded-lg">
                        <div className="text-2xl font-bold">1.2k+</div>
                        <div className="text-sm">Events Scheduled</div>
                    </div>
                    <div className="bg-blue-100 text-[#0073e6] p-6 rounded-lg">
                        <div className="text-2xl font-bold">98%</div>
                        <div className="text-sm">Satisfaction Rate</div>
                    </div>
                    <div className="bg-[#0073e6] text-white p-6 rounded-lg">
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-sm">Active Teams</div>
                    </div>
                    <div className="bg-blue-100 text-[#0073e6] p-6 rounded-lg">
                        <div className="text-2xl font-bold">24/7</div>
                        <div className="text-sm">Support Available</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#0073e6] text-white mt-12 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="mb-4">© 2024 EventScheduler. All rights reserved.</p>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="hover:text-blue-200">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-200">Terms of Service</a>
                        <a href="#" className="hover:text-blue-200">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}