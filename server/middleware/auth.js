const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Read Authorization header
  const authHeader = req.header('Authorization') || req.header('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user id to request for later use
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('JWT verify error:', error);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' })
  }
  next()
}

module.exports = { auth, requireAdmin }
