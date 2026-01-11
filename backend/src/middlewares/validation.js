
exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !email.trim()) return res.status(400).json({ success: false, message: "Email is required" });

    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Invalid email format" });

    if (!password || !password.trim()) return res.status(400).json({ success: false, message: "Password is required" });

    if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    next();
};

exports.validateUser = (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });
    if (!role) return res.status(400).json({ success: false, message: "Role is required" });
    next();
}

exports.validateProduct = (req, res, next) => {
    const { name, variants } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Product name is required" });
    if (!variants || !Array.isArray(variants) || variants.length === 0) {   
        return res.status(400).json({ success: false, message: "At least one variant is required" });
    }
    for (const variant of variants) {
        if (!variant.sku) {
            return res.status(400).json({ success: false, message: "SKU is required for each variant" });
        }
        if (variant.stock == null || isNaN(variant.stock) || variant.stock < 0) {
            return res.status(400).json({ success: false, message: "Valid quantity is required for each variant" });
        }   
        if (variant.price == null || isNaN(variant.price) || variant.price < 0) {
            return res.status(400).json({ success: false, message: "Valid price is required for each variant" });
        }
    }   
    next();
}

exports.validateSupplier = (req, res, next) => {
    const { name, email, contact, address } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Supplier name is required" });
    if (!contact) return res.status(400).json({ success: false, message: "Contact information is required" });
    if(!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!address) return res.status(400).json({ success: false, message: "Address is required" });
    next();
}

exports.validatePurchaseOrder = (req, res, next) => {
    const { supplierId, items } = req.body;
    if (!supplierId) return res.status(400).json({ success: false, message: "Supplier ID is required" });
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "At least one item is required" });
    }
    for (const item of items) {
        if (!item.sku) {
            return res.status(400).json({ success: false, message: "SKU is required for each item" });
        }
        if (item.qty == null || isNaN(item.qty) || item.qty <= 0) {
            return res.status(400).json({ success: false, message: "Valid quantity is required for each item" });
        }
        if (item.price == null || isNaN(item.price) || item.price <= 0) {
            return res.status(400).json({ success: false, message: "Valid price is required for each item" });
        }
    }
    next();
}

exports.validateUpdateStatus = (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ["DRAFT", "SENT", "CONFIRMED", "RECEIVED"];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Valid status is required" });
    }
    next();
}
