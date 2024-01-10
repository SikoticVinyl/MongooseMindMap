const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function (createdAtVal) {
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      return createdAtVal.toLocaleString('en-US', options);
    }
  }
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;