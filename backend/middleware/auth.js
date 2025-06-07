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

        if (organization.status !== 'confirmed') {
            return res.status(403).json({ success: false, error: 'Organization not approved yet' });
        }

        req.user = decoded;
        req.organization = organization;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    }
};

export default auth; 