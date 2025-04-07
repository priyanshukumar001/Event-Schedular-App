import React from 'react';
import { ArrowRight } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        description: "Sign up as a user or admin and set up your profile with your scheduling preferences and availability.",
        color: "bg-blue-50 text-blue-brand"
    },
    {
        number: "02",
        title: "Set Availability",
        description: "Admins define their available time slots, recurring schedules, and buffer times between meetings.",
        color: "bg-indigo-50 text-indigo-600"
    },
    {
        number: "03",
        title: "Schedule Events",
        description: "Users browse admin availability and request time slots for meetings, appointments, or events.",
        color: "bg-teal-50 text-teal-600"
    },
    {
        number: "04",
        title: "Receive Notifications",
        description: "Get automated confirmations, reminders, and real-time updates about your scheduled events.",
        color: "bg-amber-50 text-amber-600"
    }
];

const HowItWorks = () => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How ScheduleFlow Works</h2>
                    <p className="text-xl text-gray-600">Our simple four-step process makes scheduling events efficient and hassle-free.</p>
                </div>

                <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between relative">
                    {/* Connection line for desktop */}
                    <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center max-w-xs mx-auto md:mx-0">
                            <div className={`${step.color} w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mb-4`}>
                                {step.number}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>

                            {index < steps.length - 1 && (
                                <div className="md:hidden flex justify-center my-4">
                                    <ArrowRight className="h-6 w-6 text-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
