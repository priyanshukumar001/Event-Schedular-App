import express from 'express';
import mongoose from 'mongoose';
import { userAuth } from '../middleware/userAuth.js';
import EventType from '../models/EventType.js';
import Organization from '../models/Organization.js';
import AvailableSlot from '../models/AvailableSlot.js';

const router = express.Router();

// Get all events without any initial filtering
router.get('/', async (req, res) => {
    try {
        const events = await EventType.find()
            .populate('organization', 'name type contact locations')
            .populate('requiredFacilities')
            .populate('packages.includedFacilities')
            .lean();

        // Add available slots for each event
        const eventsWithSlots = await Promise.all(events.map(async (event) => {
            const slots = await AvailableSlot.find({
                eventType: event._id,
                isBooked: false,
                date: { $gte: new Date() }
            }).sort({ date: 1, startTime: 1 });

            return {
                ...event,
                availableSlots: slots,
                rating: 0, // Placeholder for future rating system
                reviewCount: 0 // Placeholder for future review system
            };
        }));

        res.json({ success: true, data: eventsWithSlots });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get event categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = ['medical', 'social', 'corporate'];
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get event types
router.get('/types/all', async (req, res) => {
    try {
        const types = await EventType.distinct('type');
        res.json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get event details
router.get('/:eventId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
            return res.status(400).json({ success: false, error: 'Invalid event ID' });
        }

        const event = await EventType.findById(req.params.eventId)
            .populate('organization', 'name type contact locations')
            .populate('requiredFacilities')
            .populate('packages.includedFacilities')
            .lean();

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Get available slots
        const slots = await AvailableSlot.find({
            eventType: event._id,
            isBooked: false,
            date: { $gte: new Date() }
        }).sort({ date: 1, startTime: 1 });

        const eventWithSlots = {
            ...event,
            availableSlots: slots,
            rating: 0, // Placeholder for future rating system
            reviewCount: 0 // Placeholder for future review system
        };

        res.json({ success: true, data: eventWithSlots });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get available slots for an event
router.get('/:eventId/slots', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
            return res.status(400).json({ success: false, error: 'Invalid event ID' });
        }

        const slots = await AvailableSlot.find({
            eventType: req.params.eventId,
            isBooked: false,
            date: { $gte: new Date() }
        }).sort({ date: 1, startTime: 1 });

        res.json({ success: true, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router; 