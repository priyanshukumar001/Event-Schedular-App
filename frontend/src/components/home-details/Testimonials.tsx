import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
    {
        quote: "ScheduleFlow has transformed how we organize our team meetings. The automated reminders ensure everyone shows up on time.",
        author: "Sarah Johnson",
        role: "Project Manager",
        company: "Tech Solutions Inc."
    },
    {
        quote: "As an event coordinator, I need reliable scheduling software. ScheduleFlow's centralized data management has been a game-changer.",
        author: "Michael Chen",
        role: "Event Coordinator",
        company: "Global Events"
    },
    {
        quote: "The user interface is intuitive and our clients love how easy it is to schedule appointments with our team.",
        author: "Lisa Rodriguez",
        role: "Customer Success Lead",
        company: "ServicePro"
    }
];

const Testimonials = () => {
    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
                    <p className="text-xl text-gray-600">Hear from people who have streamlined their scheduling process.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="mb-4 text-blue-brand">
                                    {/* Simple star rating */}
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="text-gray-700 mb-6 italic">"{testimonial.quote}"</blockquote>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                    <p className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
