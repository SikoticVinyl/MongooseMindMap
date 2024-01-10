const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

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

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      // Check if the user and friend exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
          return res.status(404).json({ message: 'User or friend not found' });
      }

      // Add the friend to the user's friend list
      user.friends.push(friendId);
      await user.save();

      console.log(`Friend with ID: ${friendId} has been added to the friend list of user with ID: ${userId}`);
      res.json({ message: 'Friend added' });
  } catch (err) {
      console.error(`Error adding friend to user's friend list: ${err}`);
      res.status(500).json(err);
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
    let userId = null;
    try {
      userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Delete thoughts related to the user
      await Thought.deleteMany({ userId: userId });
      
      // Remove the user
      await User.deleteOne({ _id: userId });
  
      console.log(`User with ID: ${userId} and related thoughts have been successfully removed`);
      res.json({ message: 'User and related thoughts removed' });
    } catch (err) {
      console.error(`Error during deletion of user with ID: ${userId}`, err);
      res.status(500).json(err);
    }
  });

module.exports = router;