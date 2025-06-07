import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
});

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: addressSchema, required: true }
});

const spaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    description: String,
    amenities: [String],
    images: [String]
});

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: addressSchema, required: true },
    spaces: [spaceSchema],
    images: [String]
});

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Hotel', 'Restaurant', 'Conference Center', 'Wedding Venue', 'Event Space', 'Other']
    },
    contact: { type: contactSchema, required: true },
    gstNumber: { type: String, unique: true },
    password: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    locations: [locationSchema],
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    }],
    eventTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventType'
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
organizationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Organization', organizationSchema); 