const {
    ticketSchema,
    updateTicketSchema,
    userSchema,
    loginSchema,
    updateUserSchema
} = require("./schema");

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