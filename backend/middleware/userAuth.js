import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, error: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        // Set user in the request
        req.user = {
            userId: user._id,
            type: 'user'
        };
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    }
};

export { userAuth }; 