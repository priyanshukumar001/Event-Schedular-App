import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    eventType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventType',
        required: true
    },
    package: {
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
        }
    },
    selectedFacilities: [{
        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Facility',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    addOnData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                // Ensure date is not in the past
                return v >= new Date(new Date().setHours(0, 0, 0, 0));
            },
            message: 'Booking date must be today or in the future'
        }
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Validate time format (HH:mm)
                if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v)) {
                    return false;
                }

                // If booking is for today, ensure start time is in the future
                const now = new Date();
                const [hours, minutes] = v.split(':').map(Number);
                const bookingTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

                if (this.date && this.date.toDateString() === now.toDateString()) {
                    return bookingTime > now;
                }

                return true;
            },
            message: 'Invalid time format or time must be in the future for today\'s bookings'
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
            message: 'Invalid time format or end time must be after start time'
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Total price must be greater than 0'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Invalid email format'
            }
        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\+?[\d\s-]{10,}$/.test(v);
                },
                message: 'Invalid phone number format'
            }
        }
    },
    notes: {
        type: String
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
bookingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Add compound index for efficient querying
bookingSchema.index({ organization: 1, date: 1, status: 1 });
bookingSchema.index({ eventType: 1, date: 1 });
bookingSchema.index({ 'customer.email': 1 });

export default mongoose.model('Booking', bookingSchema); 