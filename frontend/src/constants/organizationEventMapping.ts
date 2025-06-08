export const ORGANIZATION_EVENT_MAPPING: Record<string, string[]> = {
    'Hotel': ['social', 'corporate'],
    'Restaurant': ['social'],
    'Conference Center': ['corporate'],
    'Wedding Venue': ['social'],
    'Event Space': ['social', 'corporate'],
    'Hospital': ['medical'],
    'Clinic': ['medical'],
    'Medical Center': ['medical'],
    'Other': ['social', 'corporate', 'medical'] // Other type can create any event type
}; 