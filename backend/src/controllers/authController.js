const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {AUTH, COMMON} = require('../utils/msgResponse')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(400).send({ success: false, message: AUTH.INVALID_EMAIL });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send({ success: false, message: AUTH.INVALID_PASSWORD });

    const token = jwt.sign({ id: user._id, tenantId: user.tenantId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    await User.findByIdAndUpdate(user._id, { refreshToken });

    let data = { id: user._id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId, token, refreshToken };
    return res.status(200).send({ success: true, message: AUTH.LOGIN_SUCCESS, data });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send({ success: false, message: AUTH.UNAUTHORIZED });

    const user = await User.findOne({ refreshToken, isDeleted: false });
    if (!user) return res.status(403).send({ success: false, message: AUTH.INVALID_TOKEN });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
      if (err) return res.status(403).send({ success: false, message: AUTH.INVALID_TOKEN });

      const token = jwt.sign({ id: user._id, tenantId: user.tenantId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
      return res.status(200).send({ success: true, message: AUTH.TOKEN_REFRESHED, data: { token } });
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    return res.status(200).send({ success: true, message: AUTH.LOGOUT_SUCCESS });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};
