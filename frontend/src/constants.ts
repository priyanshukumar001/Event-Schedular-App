// API Configuration
export const API_BASE_URL = 'https://event-schedular-app-backend.vercel.app';

// Auth Routes
export const AUTH_ROUTES = {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
    changePassword: '/api/auth/change-password',
    checkAuth: '/api/auth/check-auth',
    logout: '/api/auth/logout'
};

// Organization Routes
export const ORGANIZATION_ROUTES = {
    list: '/organizations',
    create: '/organizations',
    get: (id: string) => `/organizations/${id}`,
    update: (id: string) => `/organizations/${id}`,
    delete: (id: string) => `/organizations/${id}`
};

// Event Type Routes
export const EVENT_TYPE_ROUTES = {
    list: '/event-types',
    create: '/event-types',
    get: (id: string) => `/event-types/${id}`,
    update: (id: string) => `/event-types/${id}`,
    delete: (id: string) => `/event-types/${id}`,
    slots: (id: string) => `/event-types/${id}/slots`
};

// Facility Routes
export const FACILITY_ROUTES = {
    list: '/facilities',
    create: '/facilities',
    get: (id: string) => `/facilities/${id}`,
    update: (id: string) => `/facilities/${id}`,
    delete: (id: string) => `/facilities/${id}`
};

// Booking Routes
export const BOOKING_ROUTES = {
    list: '/bookings',
    create: '/bookings',
    get: (id: string) => `/bookings/${id}`,
    update: (id: string) => `/bookings/${id}`,
    delete: (id: string) => `/bookings/${id}`
};

// Slot Routes
export const SLOT_ROUTES = {
    list: '/slots',
    create: '/slots',
    get: (id: string) => `/slots/${id}`,
    update: (id: string) => `/slots/${id}`,
    delete: (id: string) => `/slots/${id}`
};

// Organization routes
export const organization = `${API_BASE_URL}/api/organization`;

// Event management routes (under organization)
export const eventTypesRoute = `${API_BASE_URL}/api/event-types`;
export const facilitiesRoute = `${API_BASE_URL}/api/facilities`;
export const bookingsRoute = `${API_BASE_URL}/api/bookings`;

// Admin routes
export const admin = `${API_BASE_URL}/admin`;

// User routes
export const user = `${API_BASE_URL}/user`;

//sample data
export const sampleData = {
    user: "user_A@gmail.com",
    name: "user A",
    availableSlots: [
        {
            start: "2024-08-30T03:30:00.000Z",
            end: "2024-08-30T04:00:00.000Z",
            duration: 30,
        }
    ],
    scheduledSlots: [
        {
            "start": "2024-08-30T03:30:00.000Z",
            "end": "2024-08-30T04:00:00.000Z",
            "attendees": [
                {
                    "name": "siri",
                    "email": "siri@myparticipants.com",
                }
            ]
        }
    ]
};