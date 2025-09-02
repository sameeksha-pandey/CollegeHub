const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },             // event date/time
  venue: { type: String },
  department: { type: String, default: 'General' }, // e.g. CSE, ECE
  category: { type: String,enum: ['Technical', 'Cultural', 'Sports', 'Other'], default:'Other'}, 
  tags: [String],
  imageUrl: { type: String },                       
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);


