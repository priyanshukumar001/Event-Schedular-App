# Event Scheduling App

## Description

This is an event scheduling app built with React for the frontend, Node.js with Express for the backend, and MongoDB for the database. The app has two different interfaces:

1. **User Interface**: Users can select their available dates and time slots from a calendar UI. This information is sent to the backend in a proper format.
2. **Admin Interface**: Admins can access user data, assign fixed schedules, and manage user profiles, upcoming schedules, and user lists. The admin dashboard allows adding new schedules to users, with background checks to avoid time conflicts.

## Directory Structure

event-scheduling-app/
├── backend/
│ ├── api/
│ ├── config/
│ ├── models/
│ ├── node_modules/
│ ├── .env
│ ├── package-lock.json
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── config/
│ ├── dist/
│ ├── node_modules/
│ ├── public/
│ │ ├── static/
│ │ ├── index.html
│ ├── src/
│ │ ├── components/
│ │ ├── App.js
│ │ ├── constants.js
│ │ ├── utils/
│ ├── .gitignore
│ ├── package-lock.json
│ └── package.json

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/event-scheduling-app.git
   cd event-scheduling-app
   ```

2. **Backend Setup**:

   ```bash
   cd backend
   npm install
   replace BASE_URL in constants.js with your frontend url
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the App

1. **Start the Backend Server**:

   ```bash
   cd backend
   npm start
   ```

   **Note:** make sure to replace 'origin' under cors in server.js file with your 'localhost server' link.

2. **Start the Frontend Development Server**:
   ```bash
   cd ../frontend
   npm start
   ```

## Features

### User Interface

- Select available dates and time slots from a calendar UI.
- Select pre-specified duration or enter custom durations.
- End time is automatically filled.
- Datewise grouping of schedules.
- Submit availability to the admin.
- Shows upcoming schedules assigned by admin.
- Can see and delete particular Availability.

### Admin Interface

- Admin profile and upcoming schedules are displayed.
- Access user data and assign fixed schedules.
- Manage user profiles, upcoming schedules, and user lists.
- Add new schedules to users with background checks to avoid conflicts.

## Design Choices

- **UI Design**: Intuitive calendar UI, responsive design, user-friendly navigation, consistent design language.
- **UX Design**: Ease of use, feedback mechanisms, accessibility.
- **Backend Design**: RESTful APIs, data validation, scalability.
- **Database Design**: Well-structured schema, indexing, data security.
- **Authentication and Authorization**: Secure user authentication, role-based access control.
- **Conflict Management**: Time slot collision detection, real-time updates.
- **Admin Dashboard**: User management, analytics and reporting, notifications.
- **Testing and Quality Assurance**: User testing.

## Technologies Used

- **Frontend**: React, React Router,
- **Backend**: Node.js, Express, Argon2
- **Database**: MongoDB, Mongoose

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
