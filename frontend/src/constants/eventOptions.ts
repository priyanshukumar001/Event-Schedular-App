export interface EventTypeOption {
    value: string;
    label: string;
    description: string;
}

export interface EventSubTypeOption {
    value: string;
    label: string;
    description: string;
    requiredFacilities?: string[];
}

export const EVENT_TYPE_OPTIONS: Record<string, EventTypeOption[]> = {
    medical: [
        {
            value: 'appointment',
            label: 'Medical Appointment',
            description: 'Schedule medical consultations and check-ups'
        },
        {
            value: 'procedure',
            label: 'Medical Procedure',
            description: 'Schedule medical procedures and surgeries'
        },
        {
            value: 'checkup',
            label: 'Health Checkup',
            description: 'Schedule routine health checkups and screenings'
        }
    ],
    social: [
        {
            value: 'wedding',
            label: 'Wedding',
            description: 'Wedding ceremonies and receptions'
        },
        {
            value: 'birthday',
            label: 'Birthday Party',
            description: 'Birthday celebrations and parties'
        },
        {
            value: 'anniversary',
            label: 'Anniversary',
            description: 'Anniversary celebrations'
        },
        {
            value: 'party',
            label: 'General Party',
            description: 'General social gatherings and parties'
        }
    ],
    corporate: [
        {
            value: 'conference',
            label: 'Conference',
            description: 'Business conferences and seminars'
        },
        {
            value: 'meeting',
            label: 'Business Meeting',
            description: 'Corporate meetings and discussions'
        },
        {
            value: 'workshop',
            label: 'Workshop',
            description: 'Training workshops and skill development sessions'
        },
        {
            value: 'team-building',
            label: 'Team Building',
            description: 'Team building activities and events'
        }
    ]
};

export const EVENT_SUBTYPE_OPTIONS: Record<string, EventSubTypeOption[]> = {
    // Medical subtypes
    appointment: [
        {
            value: 'general',
            label: 'General Consultation',
            description: 'Regular medical consultation',
            requiredFacilities: ['consultation-room', 'waiting-area']
        },
        {
            value: 'specialist',
            label: 'Specialist Consultation',
            description: 'Specialized medical consultation',
            requiredFacilities: ['specialist-room', 'waiting-area']
        }
    ],
    procedure: [
        {
            value: 'minor',
            label: 'Minor Procedure',
            description: 'Minor medical procedures',
            requiredFacilities: ['procedure-room', 'recovery-room']
        },
        {
            value: 'major',
            label: 'Major Procedure',
            description: 'Major medical procedures',
            requiredFacilities: ['operation-room', 'recovery-room', 'icu']
        }
    ],
    // Social subtypes
    wedding: [
        {
            value: 'ceremony',
            label: 'Wedding Ceremony',
            description: 'Wedding ceremony venue',
            requiredFacilities: ['ceremony-space', 'dressing-room']
        },
        {
            value: 'reception',
            label: 'Wedding Reception',
            description: 'Wedding reception venue',
            requiredFacilities: ['dining-space', 'dance-floor']
        }
    ],
    birthday: [
        {
            value: 'kids',
            label: 'Kids Birthday',
            description: 'Children\'s birthday party',
            requiredFacilities: ['play-area', 'party-space']
        },
        {
            value: 'adult',
            label: 'Adult Birthday',
            description: 'Adult birthday celebration',
            requiredFacilities: ['party-space', 'bar-area']
        }
    ],
    // Corporate subtypes
    conference: [
        {
            value: 'large',
            label: 'Large Conference',
            description: 'Large-scale conferences',
            requiredFacilities: ['conference-hall', 'breakout-rooms']
        },
        {
            value: 'small',
            label: 'Small Conference',
            description: 'Small-scale conferences',
            requiredFacilities: ['meeting-room', 'lounge-area']
        }
    ],
    meeting: [
        {
            value: 'board',
            label: 'Board Meeting',
            description: 'Executive board meetings',
            requiredFacilities: ['boardroom', 'lounge-area']
        },
        {
            value: 'team',
            label: 'Team Meeting',
            description: 'Team meetings and discussions',
            requiredFacilities: ['meeting-room']
        }
    ]
}; 