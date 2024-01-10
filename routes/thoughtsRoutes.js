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

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactionData = req.body;

    // Create the reaction and get its _id
    const newReaction = await Reaction.create(reactionData);
    const reactionId = newReaction._id;

    // Push the reaction's _id to the thought's reactions array field
    await Thought.findByIdAndUpdate(thoughtId, { $push: { reactions: reactionId } });

    res.status(201).json(newReaction);
  } catch (err) {
    console.error('Error creating reaction:', err.message);
    res.status(400).json(err);
  }
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const thoughtData = req.body;
    const updatedThought = await Thought.findByIdAndUpdate(thoughtId, thoughtData, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE to remove a thought by its _id
router.delete('/:id', async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Remove the thought from the user's thoughts array
    const userId = thought.userId;
    await User.findByIdAndUpdate(userId, { $pull: { thoughts: thoughtId } });

    // Delete the thought using .deleteOne
    await Thought.deleteOne({ _id: thoughtId });

    res.json({ message: 'Thought removed' });
  } catch (err) {
    console.error(`Error during deletion of thought with ID: ${thoughtId}`, err);
    res.status(500).json(err);
  }
});

module.exports = router;