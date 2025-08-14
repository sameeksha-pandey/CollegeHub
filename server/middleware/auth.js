const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Read Authorization header
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1].trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user id to request for later use
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (erorr) {
    console.error('JWT verify error:', error);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};
