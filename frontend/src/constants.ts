export const API_BASE_URL = 'http://localhost:3000/api';

export const eventTypesRoute = `${API_BASE_URL}/event-types`;
export const facilitiesRoute = `${API_BASE_URL}/facilities`;
export const bookingsRoute = `${API_BASE_URL}/bookings`;
// export const auth = `${API_BASE_URL}/auth`; 

// export const admin = "https://event-schedular-app-backend.vercel.app/admin"; //for admin's route to backend
// export const user = "https://event-schedular-app-backend.vercel.app/user"; // for user's route to backend
// export const organization = "https://event-schedular-app-backend.vercel.app/organization"; // for organization's route to backend
export const admin = "http://localhost:3000/admin"; //for admin's route to backend
export const user = "http://localhost:3000/user"; // for user's route to backend
export const organization = "http://localhost:3000/organization"; // for organization's route to backend

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