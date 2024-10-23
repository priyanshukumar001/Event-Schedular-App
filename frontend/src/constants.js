export const admin = "https://event-schedular-app-backend.vercel.app/admin"; //for admin's route to backend
export const user = "https://event-schedular-app-backend.vercel.app/user"; // for user's route to backend
// export const admin = "http://localhost:3000/admin"; //for admin's route to backend
// export const user = "http://localhost:3000/user"; // for user's route to backend

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