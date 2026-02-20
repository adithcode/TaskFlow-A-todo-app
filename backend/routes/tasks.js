const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// Get all tasks for the logged in user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Fetch Tasks Error:', error);
        res.status(500).json({ message: 'Server error fetching tasks' });
    }
});

// Create a task
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newTask = new Task({
            title,
            description,
            dueDate: dueDate || undefined,
            priority: priority || 'Medium',
            status: status || 'Pending',
            userId: req.session.userId
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: 'Server error creating task' });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.session.userId },
            { title, description, dueDate: dueDate || undefined, priority, status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        res.json(task);
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ message: 'Server error updating task' });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete Task Error:', error);
        res.status(500).json({ message: 'Server error deleting task' });
    }
});

module.exports = router;
