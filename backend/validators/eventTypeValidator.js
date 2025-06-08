import Joi from 'joi';

const customFieldSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('text', 'number', 'boolean', 'select').required(),
    required: Joi.boolean().default(false),
    options: Joi.array().items(Joi.string())
});

const addOnFeatureSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    enabled: Joi.boolean().default(true),
    config: Joi.object()
});

const packageSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    duration: Joi.number().min(1).required(),
    includedFacilities: Joi.array().items(Joi.string()),
    maxCapacity: Joi.number().min(1).required(),
    imageUrl: Joi.string().uri()
});

export const validateEventType = (data) => {
    const schema = Joi.object({
        category: Joi.string().required(),
        type: Joi.string().required(),
        subType: Joi.string().required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().uri().required(),
        galleryImages: Joi.array().items(Joi.string().uri()),
        requiredFacilities: Joi.array().items(Joi.string()),
        packages: Joi.array().items(packageSchema).min(1).required(),
        customFields: Joi.array().items(customFieldSchema),
        addOnFeatures: Joi.array().items(addOnFeatureSchema)
    });

    return schema.validate(data);
}; 