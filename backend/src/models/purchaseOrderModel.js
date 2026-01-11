const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    status: {
      type: String,
      enum: ["DRAFT", "SENT", "CONFIRMED", "RECEIVED"],
      default: "DRAFT"
    },

    items: [
      {
        sku: {
          type: String,
          required: true
        },
        qty: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        receivedQty: {
          type: Number,
          default: 0
        }
      }
    ],
    updatedAt: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
