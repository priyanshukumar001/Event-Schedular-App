import jwt from 'jsonwebtoken';
import Organization from '../models/Organization.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, error: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const organization = await Organization.findById(decoded.id).select('-password');

        if (!organization) {
            return res.status(401).json({ success: false, error: 'Organization not found' });
        }

        if (organization.status !== 'active') {
            return res.status(403).json({ success: false, error: 'Organization not active, please wait for approval' });
        }

        // Set both user and organization in the request
        req.user = {
            id: organization._id,
            type: 'organization'
        };
        req.organization = organization;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    }
};

export { auth }; 