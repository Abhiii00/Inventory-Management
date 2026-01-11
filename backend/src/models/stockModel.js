const mongoose = require("mongoose");

const StockMovementSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    sku: {
      type: String,
      required: true
    },

    qty: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["SALE", "PURCHASE", "ADJUSTMENT"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", StockMovementSchema);
