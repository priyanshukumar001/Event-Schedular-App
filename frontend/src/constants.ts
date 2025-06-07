export const API_BASE_URL = 'http://localhost:3000/api';

// Organization routes
export const organization = `${API_BASE_URL}/organization`;

// Event management routes (under organization)
export const eventTypesRoute = `${API_BASE_URL}/event-types`;
export const facilitiesRoute = `${API_BASE_URL}/facilities`;
export const bookingsRoute = `${API_BASE_URL}/bookings`;

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