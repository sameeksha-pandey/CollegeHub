const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const Comment = require('../models/Comment')

// add comment
router.post('/:eventId', auth, async (req, res) => {
  try {
    const comment = new Comment({
      text: req.body.text,
      event: req.params.eventId,
      user: req.userId
    })
    await comment.save()
    res.status(201).json(await comment.populate('user', 'name email'))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// get comments for event
router.get('/:eventId', async (req, res) => {
  try {
    const comments = await Comment.find({ event: req.params.eventId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
