const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const { default: mongoose } = require("mongoose");

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
        if (!text) {
            return res.status(400).json({message:"text must not empty"});
        }
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
        if (!text) {
            return res.status(400).json({message:"text must not empty"});
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        todo.text = text; 
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message:"Invalid ID format"});
        }

        let deleteTodo = await Todo.findByIdAndDelete(req.params.id);
        
        if (!deleteTodo) {
            return res.status(404).json({message:"todo not found"});
        }
        res.json({ message: "Todo removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;