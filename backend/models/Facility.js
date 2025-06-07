import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    priceUnit: {
        type: String,
        enum: ['hour', 'day', 'event'],
        required: true
    },
    category: {
        type: String,
        enum: ['seating', 'catering', 'decoration', 'av', 'hospitality', 'medical'],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
facilitySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Facility', facilitySchema); 