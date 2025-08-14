const mongoose = require('mongoose');

//defining the schema
const UserSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true // removes spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // No duplicate emails
    lowercase: true
  },
    password: {
    type: String,
    required: true
  },
  role: {
  type: String,
  enum: ['student', 'admin'],
  default: 'student'
},
  createdAt: {
    type: Date,
    default: Date.now // auto timestamps
  }
});

//Creating the model
const User = mongoose.model('User', UserSchema);

module.exports = User;