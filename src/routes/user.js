const express = require("express");
const router = express.Router();
const user = require("../models/User");
const bcrypt = require("bcryptjs");

function isValidName(name) {
    if (typeof name !== "string")
        return false;
    if (/^\w{3,}/.test(name) && /^[a-zA-Z]/.test(name))
        return true;
    return false;
}

function isValidPassword(password) {
    if (typeof password !== "string")
        return false;
    // if (/.{8,}/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password)
    //     && /\d/.test(password) && /[!@#$%^&*]/.test(password))
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/.test(password))
        return true;
    return false;
}

router.get("/", async (req, res) => {
    try {
        const findUser = await user.findById(req.userId);
        if (!findUser) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.json({ findUser });
    } catch (err) {
        return res.status(500).json({ message: "server error" });
    }
});

router.put("/", async (req, res) => {
    try {
        const { name, newPassword } = req.body;

        const findUser = await user.findById(req.userId);
        if (!findUser) {
            return res.status(400).json({ message: "Invailed credentials" });
        }

        if (newPassword && newPassword !== "") {
            if (!isValidPassword(newPassword))
                return res.status(400).json({ message: "Password must include at least one lowercase letter, one uppercase letter, a number, a symbol (!@#$%^&*), and be at least 8 characters long" });
            await findUser.updateOne({ password: await bcrypt.hash(newPassword, 10) });
        }

        if (name) {
            if (!isValidName(name))
                return res.status(400).json({ message: "Invalid name" });
            await findUser.updateOne({ name: name });
        }

        return res.json({ message: "updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;