import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import EventType from '../models/EventType.js';
import Organization from '../models/Organization.js';

const router = express.Router();

// List all event types for an organization
router.get('/', auth, async (req, res) => {
    try {
        const eventTypes = await EventType.find({ organization: req.user.id })
            .populate('requiredFacilities')
            .populate('packages.includedFacilities');

        res.json({ success: true, data: eventTypes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific event type
router.get('/:eventTypeId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.eventTypeId)) {
            return res.status(400).json({ success: false, error: 'Invalid event type ID' });
        }

        const eventType = await EventType.findOne({
            _id: req.params.eventTypeId,
            organization: req.user.id
        })
            .populate('requiredFacilities')
            .populate('packages.includedFacilities');

        if (!eventType) {
            return res.status(404).json({ success: false, error: 'Event type not found' });
        }

        res.json({ success: true, data: eventType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create event type
router.post('/', auth, async (req, res) => {
    try {
        const { type, subType, category, description, imageUrl, galleryImages, requiredFacilities, packages, customFields, addOnFeatures } = req.body;

        // Validate required fields
        if (!type || !subType || !category || !description || !imageUrl || !packages || !Array.isArray(packages)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create event type
        const eventType = new EventType({
            type,
            subType,
            category,
            description,
            imageUrl,
            galleryImages: galleryImages || [],
            requiredFacilities: requiredFacilities || [],
            packages: packages.map(pkg => ({
                ...pkg,
                includedFacilities: pkg.includedFacilities || []
            })),
            customFields: customFields || [],
            addOnFeatures: addOnFeatures || [],
            organization: req.user.id
        });

        await eventType.save();

        // Update organization's event types
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            // If organization not found, rollback event type creation
            await EventType.findByIdAndDelete(eventType._id);
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        organization.eventTypes.push(eventType._id);
        await organization.save();

        res.status(201).json({
            success: true,
            data: eventType
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update event type
router.put('/:eventTypeId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.eventTypeId)) {
            return res.status(400).json({ success: false, error: 'Invalid event type ID' });
        }

        const { type, subType, category, description, imageUrl, galleryImages, requiredFacilities, packages, customFields, addOnFeatures } = req.body;

        // Validate required fields
        if (!type || !subType || !category || !description || !imageUrl || !packages || !Array.isArray(packages)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const eventType = await EventType.findOneAndUpdate(
            { _id: req.params.eventTypeId, organization: req.user.id },
            {
                type,
                subType,
                category,
                description,
                imageUrl,
                galleryImages: galleryImages || [],
                requiredFacilities: requiredFacilities || [],
                packages: packages.map(pkg => ({
                    ...pkg,
                    includedFacilities: pkg.includedFacilities || []
                })),
                customFields: customFields || [],
                addOnFeatures: addOnFeatures || []
            },
            { new: true, runValidators: true }
        )
            .populate('requiredFacilities')
            .populate('packages.includedFacilities');

        if (!eventType) {
            return res.status(404).json({ success: false, error: 'Event type not found' });
        }

        res.json({
            success: true,
            data: eventType
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete event type
router.delete('/:eventTypeId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.eventTypeId)) {
            return res.status(400).json({ success: false, error: 'Invalid event type ID' });
        }

        const eventType = await EventType.findOneAndDelete({
            _id: req.params.eventTypeId,
            organization: req.user.id
        });

        if (!eventType) {
            return res.status(404).json({ success: false, error: 'Event type not found' });
        }

        // Remove from organization's event types
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        organization.eventTypes = organization.eventTypes.filter(
            id => id.toString() !== eventType._id.toString()
        );
        await organization.save();

        res.json({
            success: true,
            message: 'Event type deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router; 