import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


//this is used to connect mongodb database
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
        return connect;
    } catch (err) {
        console.error("Connection error", err);
        process.exit(1);
    }
};

export default connectDB;