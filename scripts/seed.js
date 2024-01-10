const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thought');
const Reaction = require('../models/Reaction');

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/MongooseMindDB';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    // Function to seed the database with sample data
    async function seedDatabase() {
      try {
        //Clear existing data before seeding
        await User.deleteMany();
        await Thought.deleteMany();
        await Reaction.deleteMany();

        // Sample users data
        const sampleUsers = [
          { username: 'user1', email: 'user1@example.com' },
          { username: 'user2', email: 'user2@example.com' },
        ];

        // Create users
        const createdUsers = await User.create(sampleUsers);

        // Sample thoughts data
        const sampleThoughts = [
          { thoughtText: 'This is a thought by user1', username: 'user1' },
          { thoughtText: 'Another thought by user1', username: 'user1' },
          { thoughtText: 'Thought by user2', username: 'user2' },
        ];

        // Create thoughts linked to users
        const thoughtsWithUsers = sampleThoughts.map(thought => {
          const user = createdUsers.find(u => u.username === thought.username);
          thought.username = user.username;
          return thought;
        });

        const createdThoughts = await Thought.create(thoughtsWithUsers);

        // Update each user with the created thoughts
        for (const user of createdUsers) {
          const userThoughts = createdThoughts.filter(thought => thought.username === user.username);
          user.thoughts = userThoughts.map(thought => thought._id);
          await user.save();
        }

        // Sample reactions data
        const sampleReactions = [
          { reactionBody: 'Great thought!', username: 'user1' },
          { reactionBody: 'I agree!', username: 'user2' },
        ];

        // Create reactions linked to thoughts
        const reactionsWithThoughts = sampleReactions.map(reaction => {
          const thought = createdThoughts[Math.floor(Math.random() * createdThoughts.length)];
          reaction.thoughtId = thought._id;
          return reaction;
        });

        await Reaction.create(reactionsWithThoughts);

        console.log('Database seeded successfully');
      } catch (error) {
        console.error('Error seeding database:', error);
      } finally {
        // Close the database connection after seeding
        mongoose.disconnect();
      }
    }

    // Call the function to seed the database
    seedDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });