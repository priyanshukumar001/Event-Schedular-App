import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import Favorite from '../models/Favorite.js';
import EventType from '../models/EventType.js';
import Organization from '../models/Organization.js';

const router = express.Router();

// Get all favorites for the authenticated user
router.get('/', userAuth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.userId });

        // Populate the item details based on type
        const populatedFavorites = await Promise.all(favorites.map(async (fav) => {
            let data;
            if (fav.type === 'event') {
                data = await EventType.findById(fav.itemId)
                    .populate('organization')
                    .populate('packages.includedFacilities');
            } else if (fav.type === 'organization') {
                data = await Organization.findById(fav.itemId)
                    .populate('facilities')
                    .populate('eventTypes');
            }
            return {
                _id: fav._id,
                type: fav.type,
                data: data
            };
        }));

        res.json({ success: true, data: populatedFavorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ success: false, error: 'Error fetching favorites' });
    }
});

// Add a new favorite
router.post('/', userAuth, async (req, res) => {
    try {
        const { type, itemId } = req.body;

        // Validate type
        if (!['event', 'organization'].includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid favorite type' });
        }

        // Check if item exists
        let itemExists;
        if (type === 'event') {
            itemExists = await EventType.findById(itemId);
        } else {
            itemExists = await Organization.findById(itemId);
        }

        if (!itemExists) {
            return res.status(404).json({ success: false, error: `${type} not found` });
        }

        // Create new favorite
        const favorite = new Favorite({
            userId: req.user.userId,
            type,
            itemId
        });

        await favorite.save();

        // Return the favorite with populated data
        const populatedFavorite = {
            _id: favorite._id,
            type: favorite.type,
            data: itemExists
        };

        res.status(201).json({ success: true, data: populatedFavorite });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Item is already favorited' });
        }
        console.error('Error adding favorite:', error);
        res.status(500).json({ success: false, error: 'Error adding favorite' });
    }
});

// Remove a favorite
router.delete('/:type/:itemId', userAuth, async (req, res) => {
    try {
        const { type, itemId } = req.params;

        // Validate type
        if (!['event', 'organization'].includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid favorite type' });
        }

        const favorite = await Favorite.findOneAndDelete({
            userId: req.user.userId,
            type,
            itemId
        });

        if (!favorite) {
            return res.status(404).json({ success: false, error: 'Favorite not found' });
        }

        res.json({ success: true, message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ success: false, error: 'Error removing favorite' });
    }
});

// Check if an item is favorited
router.get('/check/:type/:itemId', userAuth, async (req, res) => {
    try {
        const { type, itemId } = req.params;

        // Validate type
        if (!['event', 'organization'].includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid favorite type' });
        }

        const favorite = await Favorite.findOne({
            userId: req.user.userId,
            type,
            itemId
        });

        res.json({ success: true, isFavorited: !!favorite });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ success: false, error: 'Error checking favorite status' });
    }
});

export default router; 