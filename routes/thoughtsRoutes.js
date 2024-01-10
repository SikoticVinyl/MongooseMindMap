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

module.exports = router;