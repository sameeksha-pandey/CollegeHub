const Event = require('../models/Event');

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, department, category, tags } = req.body;
    if (!title || !description || !date) return res.status(400).json({ error: 'Title, description and date are required' });

    const event = new Event({
      title, description, date, venue, department, category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,   // store uploaded file
      createdBy: req.userId // set by auth middleware

    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('CREATE EVENT ERROR:',err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get events with filters + pagination
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, category, search, fromDate, toDate } = req.query;
    const query = {};

    if (department) query.department = department;
    if (category) query.category = category;
    if (search){
      query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      Event.find(query).sort({ date: 1 }).skip(skip).limit(Number(limit)).populate('createdBy', 'name email role'),
      Event.countDocuments(query)
    ]);

    res.json({
      events,
      meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('LIST EVENTS ERROR:',err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email role');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update event (only creator or admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // allow if creator or admin
    const isOwner = String(event.createdBy) === String(req.userId);
    const isAdmin = req.userRole === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    // fields to update
    const allowed = ['title', 'description', 'date', 'venue', 'department', 'category', 'tags'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    }

    // handle new image upload
    if (req.file) {
      event.imageUrl = `/uploads/${req.file.filename}`;
    }

    await event.save();
    res.json(event);
  } catch (err) {
    console.error('UPDATE EVENT ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete event (only creator or admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const isOwner = String(event.createdBy) === String(req.userId);
    const isAdmin = req.userRole === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('DELETE EVENT ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};