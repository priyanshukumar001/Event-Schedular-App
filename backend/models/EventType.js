import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
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
    duration: {
        type: Number,
        required: true
    },
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    }]
});

const eventTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    subType: {
        type: String,
        required: true
    },
    requiredFields: [{
        type: String
    }],
    packages: [packageSchema],
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
eventTypeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('EventType', eventTypeSchema); 