import React from 'react';
import { Calendar, Clock, Users, Bell, MessageSquare, Database } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-blue-brand" />,
    title: "Smart Scheduling",
    description: "Easily view admin availability and request event dates with our intuitive calendar interface."
  },
  {
    icon: <Bell className="h-10 w-10 text-blue-brand" />,
    title: "Automated Reminders",
    description: "Never miss an important event with timely notifications and schedule alerts."
  },
  {
    icon: <Users className="h-10 w-10 text-blue-brand" />,
    title: "User & Admin Dashboards",
    description: "Dedicated interfaces for both users and administrators to manage their own schedules."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-blue-brand" />,
    title: "Integrated Messaging",
    description: "Communicate efficiently with built-in messaging to discuss event details."
  },
  {
    icon: <Database className="h-10 w-10 text-blue-brand" />,
    title: "Centralized Data",
    description: "All event information stored in one place for easy access and real-time updates."
  },
  {
    icon: <Clock className="h-10 w-10 text-blue-brand" />,
    title: "Time Zone Support",
    description: "Schedule events across different time zones without confusion or conflicts."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powerful Features for Seamless Scheduling</h2>
          <p className="text-xl text-gray-600">Our platform offers everything you need to manage events efficiently and communicate effectively.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
