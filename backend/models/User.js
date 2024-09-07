import mongoose from "mongoose";

const Schema = mongoose.Schema;

//defining user's Schema for storing all required informations
const SlotSchema = new Schema({
    start: { type: String },
    end: { type: String },
    duration: { type: Number }
});

const AttendeeSchema = new Schema({
    name: { type: String },
    email: { type: String }
});

const ScheduledSlotSchema = new Schema({
    start: { type: String },
    end: { type: String },
    attendees: [AttendeeSchema]
});

const UserSchema = new Schema({
    user: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    availableSlots: [SlotSchema],
    scheduledSlots: [ScheduledSlotSchema]
});

const User = mongoose.model('User', UserSchema);

export default User;
