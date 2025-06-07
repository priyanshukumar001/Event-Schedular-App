import Joi from 'joi';

export const validateFacility = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        priceUnit: Joi.string().valid('hour', 'day', 'event').required(),
        category: Joi.string().valid('seating', 'catering', 'decoration', 'av', 'hospitality', 'medical').required(),
        isAvailable: Joi.boolean().default(true),
        imageUrl: Joi.string().uri()
    });

    return schema.validate(data);
}; 