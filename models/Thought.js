const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
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
    },
    username: {
      type: String,
      required: true
    },
    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'
      }
    ]
  });

  thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });
  
  const Thought = mongoose.model('Thought', thoughtSchema);
  
  module.exports = Thought;