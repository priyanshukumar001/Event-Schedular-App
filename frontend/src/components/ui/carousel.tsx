import React, { useState, isValidElement } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CarouselProps {
    children: React.ReactNode;
    className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);
    const total = childrenArray.length;

    const next = () => {
        setCurrentIndex((current) => (current === total - 1 ? 0 : current + 1));
    };

    const previous = () => {
        setCurrentIndex((current) => (current === 0 ? total - 1 : current - 1));
    };

    return (
        <div className={cn('relative w-full max-w-xl mx-auto my-2', className)}>
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {childrenArray.map((child, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            'absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-500',
                            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        )}
                        aria-hidden={idx !== currentIndex}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            {isValidElement(child) && child.type === 'img'
                                ? (
                                    <img
                                        {...(child as React.ReactElement<any>).props}
                                        className={cn('w-full h-full object-cover rounded-lg', (child as React.ReactElement<any>).props.className)}
                                    />
                                )
                                : child}
                        </div>
                    </div>
                ))}
                {total > 1 && (
                    <>
                        <button
                            onClick={previous}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors z-20"
                            aria-label="Previous image"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors z-20"
                            aria-label="Next image"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {childrenArray.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={cn(
                                        'w-2 h-2 rounded-full transition-colors',
                                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                                    )}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}; 