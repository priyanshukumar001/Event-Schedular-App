import express from 'express';
import { auth } from '../middleware/auth.js';
import { authProfile } from '../middleware/auth.js';
import AvailableSlot from '../models/AvailableSlot.js';
import { validateSlot } from '../validators/slotValidator.js';

const router = express.Router();

// Get available slots for an event type
router.get('/event-type/:eventTypeId', authProfile, async (req, res) => {
    try {
        const { eventTypeId } = req.params;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const slots = await AvailableSlot.find({
            eventType: eventTypeId,
            isBooked: false,
            date: { $gte: today }
        }).sort({ date: 1, startTime: 1 });

        res.json({ success: true, data: slots });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch available slots' });
    }
});

// Add new slots (organization only)
router.post('/event-type/:eventTypeId', auth, async (req, res) => {
    try {
        const { eventTypeId } = req.params;
        const { slots } = req.body;
        const organizationId = req.user.id;

        // Validate slots
        const { error } = validateSlot(slots);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        // Check for overlapping slots
        for (const slot of slots) {
            const overlappingSlot = await AvailableSlot.findOne({
                eventType: eventTypeId,
                date: slot.date,
                $or: [
                    {
                        startTime: { $lt: slot.endTime },
                        endTime: { $gt: slot.startTime }
                    }
                ]
            });

            if (overlappingSlot) {
                return res.status(400).json({
                    success: false,
                    error: 'Overlapping slots are not allowed'
                });
            }
        }

        // Create slots
        const createdSlots = await AvailableSlot.insertMany(
            slots.map(slot => ({
                ...slot,
                eventType: eventTypeId,
                organization: organizationId
            }))
        );

        res.status(201).json({ success: true, data: createdSlots });
    } catch (error) {
        console.error('Error creating slots:', error);
        res.status(500).json({ success: false, error: 'Failed to create slots' });
    }
});

// Update a slot (organization only)
router.put('/:slotId', auth, async (req, res) => {
    try {
        const { slotId } = req.params;
        const updates = req.body;
        const organizationId = req.user.id;

        // Find the slot and verify organization ownership
        const slot = await AvailableSlot.findOne({
            _id: slotId,
            organization: organizationId
        });

        if (!slot) {
            return res.status(404).json({ success: false, error: 'Slot not found' });
        }

        // Don't allow updates if slot is booked
        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                error: 'Cannot update a booked slot'
            });
        }

        // Check for overlapping slots if time is being updated
        if (updates.startTime || updates.endTime || updates.date) {
            const overlappingSlot = await AvailableSlot.findOne({
                _id: { $ne: slotId },
                eventType: slot.eventType,
                date: updates.date || slot.date,
                $or: [
                    {
                        startTime: { $lt: updates.endTime || slot.endTime },
                        endTime: { $gt: updates.startTime || slot.startTime }
                    }
                ]
            });

            if (overlappingSlot) {
                return res.status(400).json({
                    success: false,
                    error: 'Overlapping slots are not allowed'
                });
            }
        }

        // Update the slot
        const updatedSlot = await AvailableSlot.findByIdAndUpdate(
            slotId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: updatedSlot });
    } catch (error) {
        console.error('Error updating slot:', error);
        res.status(500).json({ success: false, error: 'Failed to update slot' });
    }
});

// Delete a slot (organization only)
router.delete('/:slotId', auth, async (req, res) => {
    try {
        const { slotId } = req.params;
        const organizationId = req.user.id;

        // Find the slot and verify organization ownership
        const slot = await AvailableSlot.findOne({
            _id: slotId,
            organization: organizationId
        });

        if (!slot) {
            return res.status(404).json({ success: false, error: 'Slot not found' });
        }

        // Don't allow deletion if slot is booked
        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete a booked slot'
            });
        }

        await AvailableSlot.findByIdAndDelete(slotId);
        res.json({ success: true, message: 'Slot deleted successfully' });
    } catch (error) {
        console.error('Error deleting slot:', error);
        res.status(500).json({ success: false, error: 'Failed to delete slot' });
    }
});

export default router; 