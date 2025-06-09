import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import Favorite from '../models/Favorite.js';
import Event from '../models/EventType.js';
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
                data = await Event.findById(fav.itemId);
            } else if (fav.type === 'organization') {
                data = await Organization.findById(fav.itemId);
            }
            return {
                _id: fav._id,
                type: fav.type,
                data: data
            };
        }));

        res.json(populatedFavorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

// Add a new favorite
router.post('/', userAuth, async (req, res) => {
    try {
        const { type, itemId } = req.body;

        // Validate type
        if (!['event', 'organization'].includes(type)) {
            return res.status(400).json({ message: 'Invalid favorite type' });
        }

        // Check if item exists
        let itemExists;
        if (type === 'event') {
            itemExists = await Event.findById(itemId);
        } else {
            itemExists = await Organization.findById(itemId);
        }

        if (!itemExists) {
            return res.status(404).json({ message: `${type} not found` });
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

        res.status(201).json(populatedFavorite);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Item is already favorited' });
        }
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding favorite' });
    }
});

// Remove a favorite
router.delete('/:type/:itemId', userAuth, async (req, res) => {
    try {
        const { type, itemId } = req.params;

        // Validate type
        if (!['event', 'organization'].includes(type)) {
            return res.status(400).json({ message: 'Invalid favorite type' });
        }

        const result = await Favorite.findOneAndDelete({
            userId: req.user.userId,
            type,
            itemId
        });

        if (!result) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Error removing favorite' });
    }
});

// Check if an item is favorited
router.get('/check/:type/:itemId', userAuth, async (req, res) => {
    try {
        const { type, itemId } = req.params;

        // Validate type
        if (!['event', 'organization'].includes(type)) {
            return res.status(400).json({ message: 'Invalid favorite type' });
        }

        const favorite = await Favorite.findOne({
            userId: req.user.userId,
            type,
            itemId
        });

        res.json({ isFavorited: !!favorite });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ message: 'Error checking favorite status' });
    }
});

export default router; 