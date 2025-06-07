import express from 'express';
import Organization from '../models/Organization.js';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        if (organization.status !== 'confirmed') {
            return res.status(403).json({
                success: false,
                error: 'Your organization account is pending approval'
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
        const organization = await Organization.findById(req.user.id);
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
        const { name, type, contact, gstNumber } = req.body;

        // Validate required fields
        if (!name || !type || !contact) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, type, and contact are required'
            });
        }

        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        // Update organization
        organization.name = name;
        organization.type = type;
        organization.contact = contact;
        if (gstNumber) {
            organization.gstNumber = gstNumber;
        }

        await organization.save();

        res.json({
            success: true,
            data: organization
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get organization bookings
router.get('/bookings', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        const bookings = await Booking.find({ organization: req.user.id })
            .populate('eventType')
            .populate('package')
            .sort({ date: -1, startTime: -1 });

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update booking status
router.patch('/bookings/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: pending, confirmed, cancelled'
            });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            organization: req.user.id
        });

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json({
            success: true,
            data: booking
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

// Add facility to organization
router.post('/:id/facilities', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        organization.facilities.push(req.body);
        await organization.save();

        res.status(201).json({ success: true, data: organization });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Add event type to organization
router.post('/:id/event-types', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        organization.eventTypes.push(req.body);
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
        if (!['pending', 'approved', 'rejected'].includes(status)) {
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

// Event Type Management Routes

// Get all event types for an organization
router.get('/event-types', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }
        res.json({ success: true, data: organization.eventTypes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get a specific event type
router.get('/event-types/:id', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        const eventType = organization.eventTypes.id(req.params.id);
        if (!eventType) {
            return res.status(404).json({ success: false, error: 'Event type not found' });
        }

        res.json({ success: true, data: eventType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new event type
router.post('/event-types', auth, async (req, res) => {
    try {
        const { type, subType, requiredFields, packages } = req.body;

        // Validate required fields
        if (!type || !subType || !packages || !Array.isArray(packages)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: type, subType, and packages are required'
            });
        }

        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        // Validate package data
        for (const pkg of packages) {
            if (!pkg.name || !pkg.description || typeof pkg.price !== 'number' || typeof pkg.duration !== 'number' || !Array.isArray(pkg.facilities)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid package data: name, description, price, duration, and facilities are required'
                });
            }
        }

        const eventType = {
            type,
            subType,
            requiredFields: requiredFields || [],
            packages: packages.map(pkg => ({
                ...pkg,
                facilities: pkg.facilities || []
            }))
        };

        organization.eventTypes.push(eventType);
        await organization.save();

        res.status(201).json({
            success: true,
            data: eventType
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update an event type
router.put('/event-types/:id', auth, async (req, res) => {
    try {
        const { type, subType, requiredFields, packages } = req.body;

        // Validate required fields
        if (!type || !subType || !packages || !Array.isArray(packages)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: type, subType, and packages are required'
            });
        }

        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        const eventType = organization.eventTypes.id(req.params.id);
        if (!eventType) {
            return res.status(404).json({ success: false, error: 'Event type not found' });
        }

        // Validate package data
        for (const pkg of packages) {
            if (!pkg.name || !pkg.description || typeof pkg.price !== 'number' || typeof pkg.duration !== 'number' || !Array.isArray(pkg.facilities)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid package data: name, description, price, duration, and facilities are required'
                });
            }
        }

        // Update event type
        eventType.type = type;
        eventType.subType = subType;
        eventType.requiredFields = requiredFields || [];
        eventType.packages = packages.map(pkg => ({
            ...pkg,
            facilities: pkg.facilities || []
        }));

        await organization.save();

        res.json({
            success: true,
            data: eventType
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete an event type
router.delete('/event-types/:id', auth, async (req, res) => {
    try {
        const organization = await Organization.findById(req.user.id);
        if (!organization) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        const eventType = organization.eventTypes.id(req.params.id);
        if (!eventType) {
            return res.status(404).json({ success: false, error: 'Event type not found' });
        }

        eventType.remove();
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