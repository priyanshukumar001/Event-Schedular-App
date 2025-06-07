import Joi from 'joi';

export const validateBooking = (data) => {
    const schema = Joi.object({
        eventType: Joi.string().required(),
        package: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().min(0).required(),
            duration: Joi.number().min(1).required(),
            includedFacilities: Joi.array().items(Joi.string()),
            maxCapacity: Joi.number().min(1).required()
        }).required(),
        selectedFacilities: Joi.array().items(
            Joi.object({
                facility: Joi.string().required(),
                quantity: Joi.number().min(1).required()
            })
        ),
        customFields: Joi.object(),
        addOnData: Joi.object(),
        date: Joi.date().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        totalPrice: Joi.number().min(0).required(),
        status: Joi.string().valid('pending', 'confirmed', 'cancelled').default('pending'),
        customer: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        }).required(),
        notes: Joi.string()
    });

    return schema.validate(data);
}; 