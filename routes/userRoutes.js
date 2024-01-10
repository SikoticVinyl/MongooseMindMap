const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/api/users', async (req, res) => {
    try {
      const users = await User.find().populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });
