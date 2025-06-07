import express from 'express';
import Organization from '../models/Organization.js';
import { auth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

// Register a new organization
router.post('/register', async (req, res) => {
    try {
        const { name, type, contact, gstNumber, password } = req.body;

        // Essential security check: Check if organization already exists
        const existingOrg = await Organization.findOne({ 'contact.email': contact.email });
        if (existingOrg) {
            return res.status(400).json({
                success: false,
                error: 'Organization with this email already exists'
            });
        }

        // If GST number is provided, check if it's already in use
        if (gstNumber) {
            const existingGST = await Organization.findOne({ gstNumber });
            if (existingGST) {
                return res.status(400).json({
                    success: false,
                    error: 'Organization with this GST number already exists'
                });
            }
        }

        // Hash password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new organization
        const organization = new Organization({
            name,
            type,
            contact,
            gstNumber: gstNumber || undefined,
            password: hashedPassword,
            status: 'pending',
            bookings: [],
            facilities: [],
            eventTypes: []
        });

        await organization.save();

        // Create JWT token
        const token = jwt.sign(
            { id: organization._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            organization: {
                id: organization._id,
                name: organization.name,
                type: organization.type,
                contact: organization.contact,
                status: organization.status,
                bookings: [],
                facilities: [],
                eventTypes: []
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to register organization'
        });
    }
});

// Login organization
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find organization by email
        const organization = await Organization.findOne({ 'contact.email': email });
        if (!organization) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, organization.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if organization is confirmed
        if (organization.status !== 'active') {
            return res.status(403).json({
                success: false,
                error: 'Your organization account is not active, please wait for approval'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: organization._id,
                type: 'organization'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            organization: {
                id: organization._id,
                name: organization.name,
                type: organization.type,
                contact: organization.contact,
                status: organization.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred during login'
        });
    }
});

// Get organization profile
router.get('/profile', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.user.id)
            .populate('facilities')
            .populate('eventTypes')
            .populate('bookings');

        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        res.json({ success: true, data: organization });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update organization profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, phone, address, description, logo } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email,
                phone,
                address: address || '',
                description: description || '',
                logo: logo || ''
            },
            { new: true, runValidators: true }
        );

        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        res.json({
            success: true,
            data: organization
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete organization account
router.delete('/profile', auth, async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(req.user.id);

        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        res.json({
            success: true,
            message: 'Organization account deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all organizations (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { type, status } = req.query;
        const query = {};

        if (type) query.type = type;
        if (status) query.status = status;

        const organizations = await Organization.find(query).select('-password');
        res.json({ success: true, data: organizations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id).select('-password');
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        res.json({ success: true, data: organization });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update organization
router.put('/:id', auth, async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        res.json({ success: true, data: organization });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Add location to organization
router.post('/:id/locations', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        organization.locations.push(req.body);
        await organization.save();

        res.status(201).json({ success: true, data: organization });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update organization status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'active', 'inactive', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-password');

        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        res.json({ success: true, data: organization });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router; 