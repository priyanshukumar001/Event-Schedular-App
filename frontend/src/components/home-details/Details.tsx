import React from 'react';
import Header from '@/components/home-details/Header';
import Hero from '@/components/home-details/Hero';
import Features from '@/components/home-details/Features';
import HowItWorks from '@/components/home-details/HowItWorks';
import Testimonials from '@/components/home-details/Testimonials';
import CTASection from '@/components/home-details/CTASection';
import Footer from '@/components/home-details/Footer';

const Details = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* <Header /> */}
            <main className="flex-grow">
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Details;
