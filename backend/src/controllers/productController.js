const Product = require('../models/productModel');
const { COMMON, PRODUCT } = require("../utils/msgResponse");

exports.addProducts = async (req, res) => {
  try {
    const product = await Product.create({ tenantId: req.tenantId, name: req.body.name, variants: req.body.variants });
    if (!product) {
      return res.status(400).send({ success: false, message: COMMON.SOMETHING_WENT_WRONG });
    }
    return res.status(201).send({success: true, message: PRODUCT.PRODUCT_CREATED, data: product });
  } catch (error) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.productList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ tenantId: req.tenantId, isDeleted: false }).skip(skip).limit(limit);

    if (!products || products.length === 0) return res.status(404).send({ success: false, message: PRODUCT.PRODUCT_NOT_FOUND });

    return res.status(200).send({ success: true, message: PRODUCT.PRODUCT_FETCHED, data: products });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, tenantId: req.tenantId });  
    if (!product) return res.status(404).send({ success: false, message: PRODUCT.PRODUCT_NOT_FOUND });
    product.isDeleted = true;
    await product.save();
    return res.status(200).send({ success: true, message: PRODUCT.PRODUCT_DELETED });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


