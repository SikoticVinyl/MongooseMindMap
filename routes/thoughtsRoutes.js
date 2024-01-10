const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const Reaction = require('../models/Reaction');

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

module.exports = router;