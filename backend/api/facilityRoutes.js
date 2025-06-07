import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import Facility from '../models/Facility.js';
import Organization from '../models/Organization.js';

const router = express.Router();

// List all facilities for an organization
router.get('/', auth, async (req, res) => {
    try {
        const facilities = await Facility.find({ organization: req.user.id });
        res.json({ success: true, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific facility
router.get('/:facilityId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.facilityId)) {
            return res.status(400).json({ success: false, error: 'Invalid facility ID' });
        }

        const facility = await Facility.findOne({
            _id: req.params.facilityId,
            organization: req.user.id
        });

        if (!facility) {
            return res.status(404).json({ success: false, error: 'Facility not found' });
        }

        res.json({ success: true, data: facility });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create facility
router.post('/', auth, async (req, res) => {
    try {
        const { name, type, description, capacity, images, amenities, pricing } = req.body;

        // Validate required fields
        if (!name || !type || !description || !capacity) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create facility
        const facility = new Facility({
            name,
            type,
            description,
            capacity,
            images: images || [],
            amenities: amenities || [],
            pricing: pricing || {},
            organization: req.user.id
        });

        await facility.save();

        // Update organization's facilities
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            // If organization not found, rollback facility creation
            await Facility.findByIdAndDelete(facility._id);
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        organization.facilities.push(facility._id);
        await organization.save();

        res.status(201).json({
            success: true,
            data: facility
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update facility
router.put('/:facilityId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.facilityId)) {
            return res.status(400).json({ success: false, error: 'Invalid facility ID' });
        }

        const { name, type, description, capacity, images, amenities, pricing } = req.body;

        // Validate required fields
        if (!name || !type || !description || !capacity) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const facility = await Facility.findOneAndUpdate(
            { _id: req.params.facilityId, organization: req.user.id },
            {
                name,
                type,
                description,
                capacity,
                images: images || [],
                amenities: amenities || [],
                pricing: pricing || {}
            },
            { new: true, runValidators: true }
        );

        if (!facility) {
            return res.status(404).json({ success: false, error: 'Facility not found' });
        }

        res.json({
            success: true,
            data: facility
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete facility
router.delete('/:facilityId', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.facilityId)) {
            return res.status(400).json({ success: false, error: 'Invalid facility ID' });
        }

        const facility = await Facility.findOneAndDelete({
            _id: req.params.facilityId,
            organization: req.user.id
        });

        if (!facility) {
            return res.status(404).json({ success: false, error: 'Facility not found' });
        }

        // Remove from organization's facilities
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        organization.facilities = organization.facilities.filter(
            id => id.toString() !== facility._id.toString()
        );
        await organization.save();

        res.json({
            success: true,
            message: 'Facility deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router; 