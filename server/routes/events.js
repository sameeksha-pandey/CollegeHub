const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, requireAdmin } = require('../middleware/auth');
const multer = require('multer');

// Multer setup
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('image'), eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', auth, upload.single('image'), eventController.updateEvent);
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

module.exports = router;
