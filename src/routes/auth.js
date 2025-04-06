const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function isValidName(name) {
    if (typeof name !== "string")
        return false;
    if (/^\w{3,}/.test(name) && /^[a-zA-Z]/.test(name))
        return true;
    return false;
}

function isValidEmail(email) {
    if (typeof email !== "string")
        return false;
    if (/^[a-zA-Z](\w|\.){2,}@\w{2,}\.\w{2,}$/.test(email))
        return true;
    return false;
}

function isValidPassword(password) {
    if (typeof password !== "string")
        return false;
    if (/.{8,}/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password)
        && /\d/.test(password) && /[!@#$%^&*]/.test(password))
        return true;
    return false;
}

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Invailed credentials" });
        }

        if (!isValidName(name))
            return res.status(400).json({ message: "Invalid name" });

        if (!isValidEmail(email))
            return res.status(400).json({ message: "Invalid email" });
        
        if (!isValidPassword(password))
            return res.status(400).json({ message: "Password must include at least one lowercase letter, one uppercase letter, a number, a symbol (!@#$%^&*), and be at least 8 characters long" });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;