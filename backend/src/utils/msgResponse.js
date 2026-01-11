module.exports = {
    AUTH: {
        INVALID_EMAIL: "Invalid email",
        USER_NOT_FOUND: "User not found",
        INVALID_PASSWORD: "Invalid password",
        LOGIN_SUCCESS: "Login successful",
        LOGOUT_SUCCESS: "Logout successful",
        UNAUTHORIZED: "Unauthorized",
        INVALID_TOKEN: "Invalid token",
        TOKEN_REFRESHED: "Token refreshed successfully"
        
    },

    PRODUCT: {
        PRODUCT_CREATED: "Product created successfully",
        PRODUCT_FETCHED: "Products fetched successfully",
        PRODUCT_NOT_FOUND: "Product not found",
        PRODUCT_DELETED: "Product deleted successfully"
    },

    PURCHASE_ORDER: {
        PO_CREATED: "Purchase order created successfully",
        PO_FETCHED: "Purchase orders fetched successfully",
        PO_NOT_FOUND: "Purchase order not found",
        PO_UPDATED: "Purchase order updated successfully",
        PO_RECEIVED: "Purchase order received and stock updated",
        INVALID_STATUS: "Invalid purchase order status",
        RECEIVED_LOCKED: "Received purchase order cannot be updated",
        ONLY_CONFIRMED: "Only confirmed purchase orders can be received",
        ONLY_DRAFT_DELETE: "Only draft purchase orders can be deleted",
        PO_DELETED: "Purchase order deleted successfully"
    },

    SUPPLIER: {
        SUPPLIER_CREATED: "Supplier created successfully",
        SUPPLIER_FETCHED: "Suppliers fetched successfully",
        SUPPLIER_NOT_FOUND: "Supplier not found",
        SUPPLIER_DELETED: "Supplier deleted successfully",
        SUPPLIER_EXISTS: "Supplier already exists"

    },

    DASHBOARD: {
        COUNTS_FETCHED: "Dashboard counts fetched successfully",
        ORDER_STATS_FETCHED: "Order status statistics fetched successfully",
        TOP_SUPPLIERS_FETCHED: "Top suppliers fetched successfully",
        LOW_STOCK_FETCHED: "Low stock products fetched successfully"
    },

    USER: {
        USER_CREATED: "User created successfully",
        USER_FETCHED: "Users fetched successfully",
        USER_NOT_FOUND: "User not found",
        USER_DELETED: "User deleted successfully",
        MISSING_FIELDS: "Name, email, password and role are required",
        EMAIL_EXISTS: "Email already exists"
    },

    COMMON: {
        SERVER_ERROR: "Internal Server Error",
        VALIDATION_ERROR: "Validation failed",    
        SOMETHING_WENT_WRONG: "Something went wrong",
    
    }
};