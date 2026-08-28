const express = require("express");

const router = express.Router();

const {
    register,
    login,
    updateUserRole,
    getAgents
} = require("../controllers/auth");

const {
    validateUser,
    validateLogin,
    isLoggedIn,
    isAdmin,
    validateUpdateUser
} = require("../../middleware");


router.post(
    "/register",
    validateUser,
    register
);

router.post(
    "/login",
    validateLogin,
    login
);

router.put(
    "/users/:name",
    isLoggedIn,
    isAdmin,
    validateUpdateUser,
    updateUserRole
);

router.get(
    "/agents",
    isLoggedIn,
    isAdmin,
    getAgents
);

module.exports = router;