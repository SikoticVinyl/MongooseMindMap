const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');

// GET all thoughts
router.get('/api/thoughts', async (req, res) => {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  });