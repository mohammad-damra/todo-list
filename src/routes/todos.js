const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// Get all todos
router.get("/", async(req, res) => {
    try {
        const todos = await Todo.find({ user: req.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create todo
router.post("/", async(req, res) => {
    try {
        const { text } = req.body;
        const todo = new Todo({ text, user: req.userId });
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Edit todo text
router.put("/:id", async(req, res) => {
    try {
        const { text } = req.body;
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.text = text; // Update the todo's text
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Toggle todo completion
router.put("/:id/toggle", async(req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete todo
router.delete("/:id", async(req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;