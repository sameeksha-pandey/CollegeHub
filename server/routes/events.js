const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, requireAdmin } = require('../middleware/auth');

router.post('/', auth, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Admin-only delete event
router.delete('/admin/events/:id', auth, requireAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Event deleted by admin' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
});

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '', category } = req.query
  const query = {}

  if (search) {
    query.title = { $regex: search, $options: 'i' }
  }
  if (category) {
    query.category = category
  }

  try {
    const events = await Event.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('createdBy', 'name email role')
    res.json({ events })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
});

module.exports = router;
