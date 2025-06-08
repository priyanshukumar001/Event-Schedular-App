export interface Facility {
    _id: string;
    name: string;
    description: string;
    price: number;
    priceUnit: 'hour' | 'day' | 'event';
    category: 'seating' | 'catering' | 'decoration' | 'av' | 'hospitality' | 'medical';
    isAvailable: boolean;
    imageUrl?: string;
}

export interface Package {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    includedFacilities: string[]; // Facility IDs
    maxCapacity: number;
    imageUrl?: string;
}

export interface EventType {
    _id: string;
    category: 'medical' | 'social' | 'corporate';
    type: string;
    subType: string;
    description: string;
    imageUrl: string; // Main event type image
    galleryImages?: string[]; // Additional images for gallery
    requiredFacilities: string[]; // Facility IDs
    packages: Package[];
    customFields: {
        name: string;
        type: 'text' | 'number' | 'boolean' | 'select';
        required: boolean;
        options?: string[]; // For select type
    }[];
    addOnFeatures?: {
        name: string;
        description: string;
        enabled: boolean;
        config?: Record<string, any>;
    }[];
}

// Medical Event specific interfaces
export interface DoctorMeeting extends EventType {
    category: 'medical';
    addOnFeatures: {
        name: 'doctorSelection';
        description: 'Select doctor for the meeting';
        enabled: boolean;
        config: {
            doctors: Array<{
                id: string;
                name: string;
                specialization: string;
                availability: Array<{
                    day: string;
                    slots: Array<{
                        start: string;
                        end: string;
                    }>;
                }>;
            }>;
        };
    }[];
}

// Wedding Event specific interfaces
export interface WeddingEvent extends EventType {
    category: 'social';
    subType: 'wedding';
    addOnFeatures: {
        name: 'guestManagement';
        description: 'Manage wedding guests';
        enabled: boolean;
        config: {
            maxGuests: number;
            guestCategories: string[];
        };
    }[];
}

// Corporate Event specific interfaces
export interface CorporateEvent extends EventType {
    category: 'corporate';
    addOnFeatures: {
        name: 'rsvpManagement';
        description: 'Manage RSVPs for the event';
        enabled: boolean;
        config: {
            maxAttendees: number;
            requireApproval: boolean;
        };
    }[];
}

export interface Booking {
    _id: string;
    eventType: EventType;
    package: Package;
    date: string;
    startTime: string;
    endTime: string;
    selectedFacilities: Array<{
        facility: Facility;
        quantity: number;
    }>;
    customFields: Record<string, any>;
    addOnData?: Record<string, any>;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    customer: {
        name: string;
        email: string;
        phone: string;
    };
}

export interface EventTypeFormData {
    category: string;
    type: string;
    subType: string;
    description: string;
    imageUrl: string;
    galleryImages: string[];
    requiredFacilities: string[];
    packages: EventPackage[];
    customFields: CustomField[];
    addOnFeatures: AddOnFeature[];
}

export interface EventPackage {
    name: string;
    description: string;
    price: number;
    duration: number;
    includedFacilities: string[];
    maxCapacity: number;
    imageUrl?: string;
}

export interface CustomField {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
}

export interface AddOnFeature {
    name: string;
    description: string;
    enabled: boolean;
    config?: Record<string, any>;
} 