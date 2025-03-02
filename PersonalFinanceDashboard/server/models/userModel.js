const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return v.includes('@');
      },
      message: props => 'Username must contain @'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
