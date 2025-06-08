import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    fallbackIcon?: React.ReactNode;
    containerClassName?: string;
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc = 'https://via.placeholder.com/400x300?text=Image+Not+Found',
    fallbackIcon,
    containerClassName,
    onError,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState<string>(src || '');
    const [hasError, setHasError] = useState<boolean>(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
            onError?.(e);
        }
    };

    if (hasError && fallbackIcon) {
        return (
            <div className={cn('flex items-center justify-center bg-gray-100', containerClassName)}>
                {fallbackIcon}
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={cn('object-cover', className)}
            onError={handleError}
            {...props}
        />
    );
};

export { Image }; 