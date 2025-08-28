const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Event = require('../models/Event');

// GET /api/user/profile  (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // remove password
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// My Events (created by the logged-in user)
router.get('/my-events', auth, async (req, res) => {
try {
const events = await Event.find({ createdBy: req.userId })
.sort({ createdAt: -1 })
.populate('createdBy', 'name email role');
res.json(events);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

module.exports = router;
