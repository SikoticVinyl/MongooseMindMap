const mongoose = require('mongoose');
const User = require('./models/user'); // Replace with the correct path to your User model
const Thought = require('./models/thought'); // Replace with the correct path to your Thought model

// MongoDB connection string
const mongoURI = 'mongodb://localhost/MongooseMindDB'; // Replace with your MongoDB connection string

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});