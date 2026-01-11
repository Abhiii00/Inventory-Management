const Supplier = require('../models/supplierModel');
const { COMMON, SUPPLIER } = require("../utils/msgResponse");

exports.addSuppliers = async (req, res) => {
  try {
    const { name, contact, email, address} = req.body;

    const existingSupplier = await Supplier.findOne({ email, tenantId: req.tenantId });
    if(existingSupplier) return res.status(409).send({ success: false, message: SUPPLIER.SUPPLIER_EXISTS });
        
    const supplier = await Supplier.create({ tenantId: req.tenantId, name, contact, email, address });
    if (!supplier) {
      return res.status(400).send({ success: false, message: COMMON.SOMETHING_WENT_WRONG });
    }

    return res.status(201).send({success: true, message: SUPPLIER.SUPPLIER_CREATED, data: supplier });

  } catch (error) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.supplierList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const suppliers = await Supplier.find({ tenantId: req.tenantId, isDeleted: false }).skip(skip).limit(limit);

    if (!suppliers || suppliers.length === 0) return res.status(404).send({ success: false, message: SUPPLIER.SUPPLIER_NOT_FOUND });

    return res.status(200).send({ success: true, message: SUPPLIER.SUPPLIER_FETCHED, data: suppliers });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ _id: req.params.id, tenantId: req.tenantId });  
    if (!supplier) return res.status(404).send({ success: false, message: SUPPLIER.SUPPLIER_NOT_FOUND });
    supplier.isDeleted = true;
    await supplier.save();
    return res.status(200).send({ success: true, message: SUPPLIER.SUPPLIER_DELETED });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


