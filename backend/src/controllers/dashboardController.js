const User = require("../models/userModel");
const Supplier = require("../models/supplierModel");
const Product = require("../models/productModel");
const Order = require("../models/purchaseOrderModel");
const {DASHBOARD, COMMON } = require("../utils/msgResponse");

exports.dashboardCounts = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const [users, suppliers, products, orders] = await Promise.all([
      User.countDocuments({ tenantId, isDeleted: false }),
      Supplier.countDocuments({ tenantId, isDeleted: false }),
      Product.countDocuments({ tenantId, isDeleted: false}),
      Order.countDocuments({ tenantId })
    ]);
    return res.status(200).send({ 
      success: true, message: DASHBOARD.COUNTS_FETCHED, 
      data: { totalUsers: users, totalSuppliers: suppliers, totalProducts: products, totalOrders: orders } 
    });

  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.orderStatusStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([{ $match: { tenantId: req.tenantId } }, { $group: { _id: "$status", count: { $sum: 1 } } }]);
    let result = { total: 0 };
    stats.forEach(s => { result[s._id] = s.count; result.total += s.count; });
    return res.status(200).send({ success: true, message: DASHBOARD.ORDER_STATS_FETCHED, data: result });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.topSuppliers = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $match: {
          tenantId: req.tenantId
        }
      },
      {
        $group: {
          _id: "$supplierId",
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: {
          totalOrders: -1
        }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier"
        }
      },
      {
        $unwind: "$supplier"
      },
      {
        $project: {
          _id: 0,
          supplierId: "$supplier._id",
          supplierName: "$supplier.name",
          totalOrders: 1
        }
      }
    ]);

    return res.status(200).send({ success: true, message: DASHBOARD.TOP_SUPPLIERS_FETCHED, data});

  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


exports.lowStockList = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { tenantId: req.tenantId, isDeleted: false} },
      {
        $project: {
          name: 1,
          tenantId: 1,
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: { $lte: ["$$variant.stock", 2] } 
            }
          }
        }
      },
      { $match: { "variants.0": { $exists: true } } } 
    ]);

    return res.status(200).send({ success: true, message: DASHBOARD.LOW_STOCK_FETCHED, data: products});

  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};
