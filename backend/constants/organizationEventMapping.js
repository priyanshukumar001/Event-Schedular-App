export const ORGANIZATION_EVENT_MAPPING = {
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

export const isValidEventCategoryForOrganization = (orgType, eventCategory) => {
    const allowedCategories = ORGANIZATION_EVENT_MAPPING[orgType] || [];
    return allowedCategories.includes(eventCategory);
}; 