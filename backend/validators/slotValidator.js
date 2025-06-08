import Joi from 'joi';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const validateSlot = (slots) => {
    const slotSchema = Joi.object({
        date: Joi.date().min('now').required(),
        startTime: Joi.string().pattern(timeRegex).required(),
        endTime: Joi.string().pattern(timeRegex).required()
    }).custom((obj, helpers) => {
        const start = new Date(`2000-01-01T${obj.startTime}`);
        const end = new Date(`2000-01-01T${obj.endTime}`);

        if (end <= start) {
            return helpers.error('any.invalid', {
                message: 'End time must be after start time'
            });
        }

        return obj;
    });

    const schema = Joi.array().items(slotSchema).min(1).required();

    return schema.validate(slots);
}; 