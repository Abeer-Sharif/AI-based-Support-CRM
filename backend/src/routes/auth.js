const express = require("express");

const router = express.Router();

const {
    register,
    login,
    updateUserRole
} = require("../controllers/auth");

const {
    validateUser,
    validateLogin,
    isLoggedIn,
    isAdmin
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
    updateUserRole
);

module.exports = router;