const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "agent",
            team: "General"
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                team: newUser.team
            }
        });

    } catch (err) {
        console.error("Error registering user:", err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User does not exist!"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                team: user.team
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.error("Error logging in:", err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports.updateUserRole = async (req, res) => {
    try {
        const { name } = req.params;
        const { role } = req.body;

        const user = await User.findOne({ name });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            message: "Role updated successfully"
        });

    } catch (err) {
        console.error("Error updating role:", err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};