const {
    ticketSchema,
    updateTicketSchema,
    userSchema,
    loginSchema,
    updateUserSchema
} = require("./schema");

const ratelimit = require("express-rate-limit")

module.exports.validateTicket = (req, res, next) => {
    const { error } = ticketSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports.validateUpdateTicket = (req, res, next) => {
    const { error } = updateTicketSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports.validateUser = (req, res, next) => {

    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports.validateLogin = (req, res, next) => {

    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports.validateUpdateUser = (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports.isAdmin = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};

module.exports.loginLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    
    message: {
        message: "Too many login attempts. Please try again later."
    }
})

module.exports.registerLimiter = ratelimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many register attempts. Please try again later."
    }
})