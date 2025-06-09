import express from 'express';
import { json as bodyParser } from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';

import { auth } from './middleware/auth.js';
import { userAuth } from './middleware/userAuth.js';
import organizationRoutes from './api/organization.js';
import eventTypeRoutes from './api/eventTypeRoutes.js';
import facilityRoutes from './api/facilityRoutes.js';
import bookingRoutes from './api/bookingRoutes.js';
import authRoutes from './api/auth.js';
import favoriteRoutes from './api/favoriteRoutes.js';
// import UserRouter from './api/User_route.js';
// import AdminRouter from './api/Admin_route.js';
// import AvailableRoute from './api/Available_route.js';
// import AllotmentRoute from './api/Allottment_route.js';
// import userRoutes from './api/userRoutes.js';
import slotRoutes from './api/slotRoutes.js';

dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
    // origin: 'https://event-schedular-app.vercel.app', // Your frontend's origin //need to be updated

    origin: process.env.FRONTEND_URL || 'http://localhost:1234',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Middleware
app.use(bodyParser());
app.use(express.json());

// Routes
// User routes
// app.use('/user', UserRouter);
// app.use('/user', AvailableRoute);

// Admin routes
// app.use('/admin', AdminRouter);
// app.use('/admin', AllotmentRoute);

// app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/event-types', auth, eventTypeRoutes);
app.use('/api/facilities', auth, facilityRoutes);
app.use('/api/bookings', auth, bookingRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/favorites', userAuth, favoriteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});