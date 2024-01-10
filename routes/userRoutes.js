const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user by _id and populate thought and friend data
router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('thoughts').populate('friends');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // POST a new user
router.post('/', async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await User.create(userData);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json(err);
    }
  });

  // PUT to update a user by _id
router.put('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  });

  // DELETE to remove user by _id
router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Optionally remove associated thoughts
      if (user.thoughts.length > 0) {
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
      }
      
      await user.remove();
      res.json({ message: 'User and associated thoughts removed' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;