const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth'); // ensure this sets req.userId and req.userRole

router.post('/', auth, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;
