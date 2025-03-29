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
        if (name) {
            await findUser.updateOne({ name: name });
        }
        if (newPassword && newPassword !== "") {
            await findUser.updateOne({ password: await bcrypt.hash(newPassword, 10) });
        }
        return res.json(findUser);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;