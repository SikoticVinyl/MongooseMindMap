const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const Reaction = require('../models/Reaction');
const User = require('../models/User'); 

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate({
      path: 'reactions',
      model: Reaction
    });
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by its _id
router.get('/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const thoughtData = req.body;
    const newThought = await Thought.create(thoughtData);

    // Push the created thought's _id to the associated user's thoughts array field
    const userId = newThought.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });
    }

    res.status(201).json(newThought);
  } catch (err) {
    console.error('Error creating thought:', err.message); // Log the error message
    res.status(400).json(err);
  }
});

module.exports = router;