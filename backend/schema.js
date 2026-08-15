const Joi = require("joi");

const ticketSchema = Joi.object({
    customer_name: Joi.string()
        .trim()
        .required(),

    customer_email: Joi.string()
        .email()
        .required(),

    subject: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .trim()
        .required()
});

const updateTicketSchema = Joi.object({
    status: Joi.string()
        .valid("Open", "In Progress", "Closed")
        .optional(),

    notes: Joi.string().optional()
});

const userSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});

module.exports = {
    ticketSchema,
    updateTicketSchema,
    userSchema,
    loginSchema
};