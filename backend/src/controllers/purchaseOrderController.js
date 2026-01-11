const PurchaseOrder = require('../models/purchaseOrderModel');
const Product = require('../models/productModel');
const StockMovement = require('../models/stockModel');
const mongoose = require('mongoose');
const { COMMON, PURCHASE_ORDER } = require("../utils/msgResponse");

exports.addPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items } = req.body;
    const po = await PurchaseOrder.create({ tenantId: req.tenantId, supplierId, items, status: "DRAFT" });
    if (!po){
      return res.status(400).send({ success: false, message: COMMON.SOMETHING_WENT_WRONG });
    }
    return res.status(201).send({ success: true, message: PURCHASE_ORDER.PO_CREATED, data: po });
  } catch (error) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.PurchaseOrderList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pos = await PurchaseOrder.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(req.tenantId) } },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          tenantId: 1,
          supplierId: 1,
          supplierName: "$supplier.name",
          status: 1,
          items: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    if (!pos || pos.length === 0) return res.status(404).send({ success: false, message: PURCHASE_ORDER.PURCHASE_ORDER_NOT_FOUND });

    return res.status(200).send({ success: true, message: PURCHASE_ORDER.PURCHASE_ORDER_FETCHED, data: pos });
  } catch (err) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["DRAFT", "SENT", "CONFIRMED", "RECEIVED"];
    if (!allowedStatus.includes(status)) return res.status(400).send({ success: false, message: PURCHASE_ORDER.INVALID_STATUS });
    const po = await PurchaseOrder.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!po) return res.status(404).send({ success: false, message: PURCHASE_ORDER.PURCHASE_ORDER_NOT_FOUND });
    if (po.status === "RECEIVED") return res.status(400).send({ success: false, message: PURCHASE_ORDER.RECEIVED_LOCKED });
    po.status = status;
    await po.save();
    return res.status(200).send({ success: true, message: `Purchase order marked as ${status}`, data: po });
  } catch (error) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.PurchaseOrderReceive = async (req, res) => {
  try {
    const po = await PurchaseOrder.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!po) return res.status(404).send({ success: false, message: PURCHASE_ORDER.PURCHASE_ORDER_NOT_FOUND });
    if (po.status !== "CONFIRMED") return res.status(400).send({ success: false, message: PURCHASE_ORDER.RECEIVE_ONLY_CONFIRMED });

    for (const item of po.items) {
      const product = await Product.findOne({ tenantId: req.tenantId, "variants.sku": item.sku });
      if (!product) return res.status(404).send({ success: false, message: `Product not found for SKU ${item.sku}` });
      const variant = product.variants.find(v => v.sku === item.sku);
      if (!variant) return res.status(404).send({ success: false, message: `Variant not found for SKU ${item.sku}` });

      const receivedQty = item.qty - (item.receivedQty || 0);
      if (receivedQty <= 0) continue;

      variant.stock += receivedQty;
      await StockMovement.create({ tenantId: req.tenantId, supplierId: po.supplierId, sku: item.sku, qty: receivedQty, type: "PURCHASE" });
      item.receivedQty = item.qty;
      await product.save();
    }

    po.status = "RECEIVED";
    await po.save();
    return res.status(200).send({ success: true, message: PURCHASE_ORDER.PO_RECEIVED, data: po });
  } catch (error) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

exports.getStockMovements = async (req, res) => {
  try {
    const movements = await StockMovement.aggregate([
      {
        $match: {
          tenantId: new mongoose.Types.ObjectId(req.tenantId),
        }
      },
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$sku", tenantId: "$tenantId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tenantId", "$$tenantId"] },
                    {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$items",
                              as: "item",
                              cond: { $eq: ["$$item.sku", "$$sku"] }
                            }
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            },
            { $project: { supplierId: 1 } }
          ],
          as: "po"
        }
      },
      { $unwind: { path: "$po", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "suppliers",
          localField: "po.supplierId",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sku: 1,
          qty: 1,
          type: 1,
          createdAt: 1,
          supplierName: "$supplier.name"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).send({
      success: true,
      message: COMMON.STOCK_MOVEMENTS_FETCHED,
      data: movements
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: COMMON.SERVER_ERROR, error: err.message });
  }
};

