import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Organization from '../models/Organization.js';

const router = express.Router();

// List all bookings for an organization
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ organization: req.user.id })
            .populate('eventType')
            .populate('facilities')
            .populate('customer');

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific booking
router.get('/:bookingId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
            return res.status(400).json({ success: false, error: 'Invalid booking ID' });
        }

        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            organization: req.user.id
        })
            .populate('eventType')
            .populate('facilities')
            .populate('customer');

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create booking
router.post('/', auth, async (req, res) => {
    try {
        const {
            eventType,
            facilities,
            customer,
            startTime,
            endTime,
            status,
            paymentStatus,
            totalAmount,
            notes
        } = req.body;

        // Validate required fields
        if (!eventType || !facilities || !customer || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create booking
        const booking = new Booking({
            eventType,
            facilities,
            customer,
            startTime,
            endTime,
            status: status || 'pending',
            paymentStatus: paymentStatus || 'pending',
            totalAmount,
            notes: notes || '',
            organization: req.user.id
        });

        await booking.save();

        // Update organization's bookings
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            // If organization not found, rollback booking creation
            await Booking.findByIdAndDelete(booking._id);
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        organization.bookings.push(booking._id);
        await organization.save();

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update booking
router.put('/:bookingId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
            return res.status(400).json({ success: false, error: 'Invalid booking ID' });
        }

        const {
            eventType,
            facilities,
            customer,
            startTime,
            endTime,
            status,
            paymentStatus,
            totalAmount,
            notes
        } = req.body;

        // Validate required fields
        if (!eventType || !facilities || !customer || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.bookingId, organization: req.user.id },
            {
                eventType,
                facilities,
                customer,
                startTime,
                endTime,
                status: status || 'pending',
                paymentStatus: paymentStatus || 'pending',
                totalAmount,
                notes: notes || ''
            },
            { new: true, runValidators: true }
        )
            .populate('eventType')
            .populate('facilities')
            .populate('customer');

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete booking
router.delete('/:bookingId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
            return res.status(400).json({ success: false, error: 'Invalid booking ID' });
        }

        const booking = await Booking.findOneAndDelete({
            _id: req.params.bookingId,
            organization: req.user.id
        });

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Remove from organization's bookings
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        organization.bookings = organization.bookings.filter(
            id => id.toString() !== booking._id.toString()
        );
        await organization.save();

        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router; 