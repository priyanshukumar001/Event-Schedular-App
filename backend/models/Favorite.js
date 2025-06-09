import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['event', 'organization'],
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'type'
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can't favorite the same item twice
favoriteSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite; 