const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { COMMON, USER } = require("../utils/msgResponse");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email, tenantId: req.tenantId });
    if (existingUser) return res.status(409).send({ success: false, message: USER.EMAIL_EXISTS });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ tenantId: req.tenantId, name, email, password: hashedPassword, role });
    if (!user) {
      return res.status(400).send({ success: false, message: COMMON.SOMETHING_WENT_WRONG });
    }
    return res.status(201).send({ success: true, message: USER.USER_CREATED, data: user });

  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.userList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ tenantId: req.tenantId, isDeleted: false }).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (!users || users.length === 0) return res.status(404).send({ success: false, message: USER.USER_NOT_FOUND });

    return res.status(200).send({ success: true, message: USER.USER_FETCHED, data: users });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!user) return res.status(404).send({ success: false, message: USER.USER_NOT_FOUND });
    user.isDeleted = true;
    await user.save();
    return res.status(200).send({ success: true, message: USER.USER_DELETED });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

