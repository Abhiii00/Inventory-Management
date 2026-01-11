const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({success: false, message: 'Token required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).send({success: false, message: 'Invalid token' });

    if(user.refreshToken == null) {
      return res.status(401).send({success: false, message: 'Token expired, please login again' });
    } 

    req.user = user;
    req.tenantId = user.tenantId;
    next();
  } catch {
    return res.status(401).send({success: false, message: 'Invalid or expired token' });
  }
};
