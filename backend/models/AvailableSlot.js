import mongoose from 'mongoose';

const availableSlotSchema = new mongoose.Schema({
    eventType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventType',
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                // Ensure date is not in the past
                return v >= new Date(new Date().setHours(0, 0, 0, 0));
            },
            message: 'Date must be today or in the future'
        }
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Validate time format (HH:mm)
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Invalid time format'
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Validate time format (HH:mm)
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v)) {
                    return false;
                }

                // Ensure end time is after start time
                if (this.startTime) {
                    const [startHours, startMinutes] = this.startTime.split(':').map(Number);
                    const [endHours, endMinutes] = v.split(':').map(Number);

                    const startTotalMinutes = startHours * 60 + startMinutes;
                    const endTotalMinutes = endHours * 60 + endMinutes;

                    return endTotalMinutes > startTotalMinutes;
                }

                return true;
            },
            message: 'End time must be after start time'
        }
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
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
availableSlotSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Add compound index for efficient querying
availableSlotSchema.index({ eventType: 1, date: 1, startTime: 1 });
availableSlotSchema.index({ organization: 1, date: 1 });
availableSlotSchema.index({ isBooked: 1 });

export default mongoose.model('AvailableSlot', availableSlotSchema); 