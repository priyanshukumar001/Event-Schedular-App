export interface EventCategory {
    value: string;
    label: string;
    description: string;
    subCategories: EventSubCategory[];
}

export interface EventSubCategory {
    value: string;
    label: string;
    description: string;
    subSubCategories: EventSubSubCategory[];
}

export interface EventSubSubCategory {
    value: string;
    label: string;
    description: string;
}

// Medical Events
export const MEDICAL_EVENTS: EventCategory = {
    value: 'medical',
    label: 'Medical Events',
    description: 'Healthcare and medical-related events',
    subCategories: [
        {
            value: 'Medical Consultation',
            label: 'Medical Consultations',
            description: 'One-on-one medical consultations',
            subSubCategories: [
                {
                    value: 'General Consultation',
                    label: 'General Consultation',
                    description: 'General health check-up and consultation'
                },
                {
                    value: 'Specialist Consultation',
                    label: 'Specialist Consultation',
                    description: 'Consultation with medical specialists'
                },
                {
                    value: 'Follow-up Consultation',
                    label: 'Follow-up Consultation',
                    description: 'Follow-up medical appointments'
                }
            ]
        },
        {
            value: 'Medical Procedure',
            label: 'Medical Procedures',
            description: 'Medical procedures and treatments',
            subSubCategories: [
                {
                    value: 'Minor Procedures',
                    label: 'Minor Procedures',
                    description: 'Non-invasive and minor medical procedures'
                },
                {
                    value: 'Diagnostic Procedures',
                    label: 'Diagnostic Procedures',
                    description: 'Medical tests and diagnostic procedures'
                },
                {
                    value: 'Therapeutic Procedures',
                    label: 'Therapeutic Procedures',
                    description: 'Treatment and therapeutic procedures'
                }
            ]
        },
        {
            value: 'Health Check-up',
            label: 'Health Check-ups',
            description: 'Comprehensive health examinations',
            subSubCategories: [
                {
                    value: 'Routine Check-up',
                    label: 'Routine Check-up',
                    description: 'Regular health check-up'
                },
                {
                    value: 'Comprehensive Check-up',
                    label: 'Comprehensive Check-up',
                    description: 'Detailed health assessment'
                },
                {
                    value: 'Specialized Check-up',
                    label: 'Specialized Check-up',
                    description: 'Specialized health screening'
                }
            ]
        }
    ]
};

// Social Events
export const SOCIAL_EVENTS: EventCategory = {
    value: 'social',
    label: 'Social Events',
    description: 'Personal and social gatherings',
    subCategories: [
        {
            value: 'Wedding',
            label: 'Wedding Events',
            description: 'Wedding ceremonies and celebrations',
            subSubCategories: [
                {
                    value: 'Wedding Ceremony',
                    label: 'Wedding Ceremony',
                    description: 'Main wedding ceremony'
                },
                {
                    value: 'Wedding Reception',
                    label: 'Wedding Reception',
                    description: 'Wedding celebration and party'
                },
                {
                    value: 'Pre-wedding Events',
                    label: 'Pre-wedding Events',
                    description: 'Engagement and pre-wedding celebrations'
                }
            ]
        },
        {
            value: 'Birthday',
            label: 'Birthday Celebrations',
            description: 'Birthday parties and celebrations',
            subSubCategories: [
                {
                    value: 'Kids Birthday',
                    label: 'Kids Birthday',
                    description: 'Children\'s birthday parties'
                },
                {
                    value: 'Adult Birthday',
                    label: 'Adult Birthday',
                    description: 'Adult birthday celebrations'
                },
                {
                    value: 'Milestone Birthday',
                    label: 'Milestone Birthday',
                    description: 'Special milestone birthday celebrations'
                }
            ]
        },
        {
            value: 'Anniversary',
            label: 'Anniversary Celebrations',
            description: 'Anniversary parties and events',
            subSubCategories: [
                {
                    value: 'Wedding Anniversary',
                    label: 'Wedding Anniversary',
                    description: 'Wedding anniversary celebrations'
                },
                {
                    value: 'Business Anniversary',
                    label: 'Business Anniversary',
                    description: 'Company and business anniversaries'
                },
                {
                    value: 'Personal Anniversary',
                    label: 'Personal Anniversary',
                    description: 'Personal milestone anniversaries'
                }
            ]
        }
    ]
};

// Corporate Events
export const CORPORATE_EVENTS: EventCategory = {
    value: 'corporate',
    label: 'Corporate Events',
    description: 'Business and professional events',
    subCategories: [
        {
            value: 'Conference',
            label: 'Conferences',
            description: 'Professional conferences and seminars',
            subSubCategories: [
                {
                    value: 'Business Conference',
                    label: 'Business Conference',
                    description: 'Business and industry conferences'
                },
                {
                    value: 'Technical Conference',
                    label: 'Technical Conference',
                    description: 'Technical and professional conferences'
                },
                {
                    value: 'Academic Conference',
                    label: 'Academic Conference',
                    description: 'Educational and research conferences'
                }
            ]
        },
        {
            value: 'Meeting',
            label: 'Business Meetings',
            description: 'Corporate meetings and gatherings',
            subSubCategories: [
                {
                    value: 'Board Meeting',
                    label: 'Board Meeting',
                    description: 'Board of directors meetings'
                },
                {
                    value: 'Team Meeting',
                    label: 'Team Meeting',
                    description: 'Department and team meetings'
                },
                {
                    value: 'Client Meeting',
                    label: 'Client Meeting',
                    description: 'Client and stakeholder meetings'
                }
            ]
        },
        {
            value: 'Training',
            label: 'Training Sessions',
            description: 'Professional development and training',
            subSubCategories: [
                {
                    value: 'Workshop',
                    label: 'Workshop',
                    description: 'Hands-on training workshops'
                },
                {
                    value: 'Seminar',
                    label: 'Seminar',
                    description: 'Educational seminars'
                },
                {
                    value: 'Corporate Retreat',
                    label: 'Corporate Retreat',
                    description: 'Team building and planning retreats'
                }
            ]
        }
    ]
};

// Organization Type to Event Category Mapping
export const ORGANIZATION_EVENT_MAPPING: Record<string, string[]> = {
    'Hotel': ['social', 'corporate'],
    'Restaurant': ['social'],
    'Conference Center': ['corporate'],
    'Wedding Venue': ['social'],
    'Event Space': ['social', 'corporate'],
    'Hospital': ['medical'],
    'Clinic': ['medical'],
    'Medical Center': ['medical'],
    'Other': ['social', 'corporate', 'medical']
};

// Helper functions
export const getEventCategories = (): EventCategory[] => {
    return [MEDICAL_EVENTS, SOCIAL_EVENTS, CORPORATE_EVENTS];
};

export const getSubCategories = (category: string): EventSubCategory[] => {
    const eventCategory = getEventCategories().find(cat => cat.value === category);
    return eventCategory?.subCategories || [];
};

export const getSubSubCategories = (category: string, subCategory: string): EventSubSubCategory[] => {
    const subCategories = getSubCategories(category);
    const subCategoryObj = subCategories.find(sub => sub.value === subCategory);
    return subCategoryObj?.subSubCategories || [];
};

export const isValidEventCategoryForOrganization = (orgType: string, eventCategory: string): boolean => {
    const allowedCategories = ORGANIZATION_EVENT_MAPPING[orgType] || [];
    return allowedCategories.includes(eventCategory);
}; 