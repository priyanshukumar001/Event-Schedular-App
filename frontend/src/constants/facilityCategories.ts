export interface FacilityCategory {
    value: string;
    label: string;
    description: string;
}

// Define facility categories for each organization type
export const FACILITY_CATEGORIES: Record<string, FacilityCategory[]> = {
    'Hospital': [
        {
            value: 'Operating Room',
            label: 'Operating Room',
            description: 'Surgical facilities with advanced medical equipment'
        },
        {
            value: 'ICU',
            label: 'ICU',
            description: 'Intensive care units with life support systems'
        },
        {
            value: 'Emergency Room',
            label: 'Emergency Room',
            description: 'Emergency medical care facilities'
        },
        {
            value: 'Diagnostic Laboratory',
            label: 'Diagnostic Laboratory',
            description: 'Medical testing and diagnostic facilities'
        },
        {
            value: 'Patient Room',
            label: 'Patient Room',
            description: 'Inpatient care facilities'
        }
    ],
    'Clinic': [
        {
            value: 'Consultation Room',
            label: 'Consultation Room',
            description: 'Private rooms for patient consultations'
        },
        {
            value: 'Treatment Room',
            label: 'Treatment Room',
            description: 'Rooms for medical procedures and treatments'
        },
        {
            value: 'Examination Room',
            label: 'Examination Room',
            description: 'Rooms for patient examinations'
        },
        {
            value: 'Waiting Area',
            label: 'Waiting Area',
            description: 'Patient waiting facilities'
        }
    ],
    'Hotel': [
        {
            value: 'Banquet Hall',
            label: 'Banquet Hall',
            description: 'Large halls for events and gatherings'
        },
        {
            value: 'Meeting Room',
            label: 'Meeting Room',
            description: 'Conference and meeting facilities'
        },
        {
            value: 'Restaurant',
            label: 'Restaurant',
            description: 'Dining facilities'
        },
        {
            value: 'Swimming Pool',
            label: 'Swimming Pool',
            description: 'Swimming and recreational facilities'
        },
        {
            value: 'Spa',
            label: 'Spa',
            description: 'Wellness and relaxation facilities'
        }
    ],
    'Restaurant': [
        {
            value: 'Private Dining Room',
            label: 'Private Dining Room',
            description: 'Exclusive dining areas for private events'
        },
        {
            value: 'Outdoor Seating',
            label: 'Outdoor Seating',
            description: 'Open-air dining facilities'
        },
        {
            value: 'Bar',
            label: 'Bar',
            description: 'Beverage service facilities'
        },
        {
            value: 'Kitchen',
            label: 'Kitchen',
            description: 'Food preparation facilities'
        }
    ],
    'Conference Center': [
        {
            value: 'Conference Room',
            label: 'Conference Room',
            description: 'Meeting and presentation facilities'
        },
        {
            value: 'Auditorium',
            label: 'Auditorium',
            description: 'Large presentation and event spaces'
        },
        {
            value: 'Exhibition Hall',
            label: 'Exhibition Hall',
            description: 'Spaces for displays and exhibitions'
        },
        {
            value: 'Breakout Room',
            label: 'Breakout Room',
            description: 'Smaller meeting rooms for group discussions'
        },
        {
            value: 'Catering Kitchen',
            label: 'Catering Kitchen',
            description: 'Food preparation facilities for events'
        }
    ],
    'Wedding Venue': [
        {
            value: 'Ceremony Space',
            label: 'Ceremony Space',
            description: 'Areas for wedding ceremonies'
        },
        {
            value: 'Reception Hall',
            label: 'Reception Hall',
            description: 'Spaces for wedding receptions'
        },
        {
            value: 'Bridal Suite',
            label: 'Bridal Suite',
            description: 'Private preparation areas'
        },
        {
            value: 'Outdoor Garden',
            label: 'Outdoor Garden',
            description: 'Garden and outdoor event spaces'
        }
    ],
    'Event Space': [
        {
            value: 'Main Hall',
            label: 'Main Hall',
            description: 'Primary event space'
        },
        {
            value: 'Stage',
            label: 'Stage',
            description: 'Performance and presentation areas'
        },
        {
            value: 'Green Room',
            label: 'Green Room',
            description: 'Preparation areas for performers'
        },
        {
            value: 'Storage',
            label: 'Storage',
            description: 'Equipment and supply storage'
        }
    ]
};

// Helper function to get facility categories for an organization type
export const getFacilityCategories = (organizationType: string): FacilityCategory[] => {
    // console.log('Getting categories for organization type:', organizationType); // Debug log
    const categories = FACILITY_CATEGORIES[organizationType] || [];
    // console.log('Found categories:', categories); // Debug log
    return categories;
};

// Helper function to check if a facility category is valid for an organization type
export const isValidFacilityCategory = (organizationType: string, category: string): boolean => {
    const categories = getFacilityCategories(organizationType);
    return categories.some(cat => cat.value === category);
}; 