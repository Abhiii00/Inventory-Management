const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true
    },

    contact: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", SupplierSchema);
