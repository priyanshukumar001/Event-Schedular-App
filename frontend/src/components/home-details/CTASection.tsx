import React from 'react';
import { Button } from "@/components/ui/button";

const CTASection = () => {
    return (
        <section className="bg-blue-brand py-16 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Streamline Your Scheduling?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    Join thousands of users who have transformed their event planning and scheduling process.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button className="bg-white text-blue-brand hover:bg-gray-100 text-lg px-8 py-6">
                        Start Free Trial
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-blue-800 text-lg px-8 py-6">
                        Learn More
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
