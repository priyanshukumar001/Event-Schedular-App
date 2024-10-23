import express from 'express';
import { json as bodyParser } from 'express';
import connectDB from './config/db.js';
import UserRouter from './api/User_route.js';
import AdminRouter from './api/Admin_route.js';
import cors from 'cors';
import AvailableRoute from './api/Available_route.js';
import AllotmentRoute from './api/Allottment_route.js';
import { BASE_URL } from './config/constants.js'

// using express
const app = express();
connectDB();
const port = 3000; //default port

// Use CORS middleware
app.use(cors({
    origin: 'https://event-schedular-app.vercel.app', // Your frontend's origin //need to be updated
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

//for accepting post form data
app.use(bodyParser());
app.use('/user', UserRouter);
app.use('/user', AvailableRoute);
app.use('/admin', AdminRouter);
app.use('/admin', AllotmentRoute);


// listening to client requests
app.listen(port, () => {
    console.log(`Sever running on port ${port}`);
})