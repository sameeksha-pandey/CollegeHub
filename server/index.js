const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Serve uploaded images
app.use('/uploads', express.static('uploads'));  

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const commentRoutes = require('./routes/comments')
app.use('/api/comments', commentRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MONGODB connected successfully...');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('DB connection error: ', error));
