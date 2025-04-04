const express = require("express");
const router = express.Router();
const user = require("../models/User");
const bcrypt = require("bcryptjs");

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
        if (!isNaN(name)) {
            return res.status(400).json({ message: "name must be string not a number" })
        }
        const findUser = await user.findById(req.userId);
        if (!findUser) {
            return res.status(400).json({ message: "Invailed credentials" });
        }

        if (newPassword && newPassword !== "") {
            if (newPassword.length < 8) {
                return res.status(400).json({ message: "password must be at least 8 characters long" });
            }
    
            if (!/[a-z]/.test(newPassword)) {
                return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
            }
    
            if (!/[A-Z]/.test(newPassword)) {
                return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
            }
    
            if (!/\d/.test(newPassword)) {
                return res.status(400).json({ message: "Password must contain at least one number" });
            }
    
            if (!/[!@#$%^&*]/.test(newPassword)) {
                return res.status(400).json({ message: "Password must contain at least one special symbol (!@#$%^&*)" });
            }
            await findUser.updateOne({ password: await bcrypt.hash(newPassword, 10) });
        }

        if (name) {
            await findUser.updateOne({ name: name });
        }
        
        return res.json({message:"updated successfully"});
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;