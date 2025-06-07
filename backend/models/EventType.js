import mongoose from 'mongoose';

const customFieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'number', 'boolean', 'select'],
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    options: [String]
});

const addOnFeatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    config: {
        type: mongoose.Schema.Types.Mixed
    }
});

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
    includedFacilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    }],
    maxCapacity: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    }
});

const eventTypeSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['medical', 'social', 'corporate'],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    subType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    galleryImages: [{
        type: String
    }],
    requiredFacilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    }],
    packages: [packageSchema],
    customFields: [customFieldSchema],
    addOnFeatures: [addOnFeatureSchema],
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