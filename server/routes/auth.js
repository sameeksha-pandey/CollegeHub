const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// @route   POST /api/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
     
    //Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Save new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });
    
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login

router.post('/login', async (req,res) => {
  try{
    const {email, password} = req.body;

    //Validation
    if(!email || !password){
       return res.status(400).json({ error: 'All fields are required' });  
    }

    //Check if user exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //Payload : encode userId
    const payload = { userId : user._id, role: user.role };

    //Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET , {
      expiresIn : process.env.JWT_EXPIRES_IN || '1h'
    });

    // Send Token + user info (without password)
    res.status(200).json({ 
      token,
      user : { id: user._id , name: user.name, email: user.email}
     });

  } catch (error){
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });

  }
});

module.exports = router;
