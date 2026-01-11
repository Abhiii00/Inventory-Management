# Architecture

## Multi-Tenancy
This project uses a single MongoDB database with shared collections.
Each document contains a `tenantId` field to isolate data between tenants.

All APIs automatically filter data using `tenantId` taken from JWT middleware.
This ensures users can only access their own tenant data.

## Authentication & Authorization
JWT-based authentication is used.
Role Based Access Control (RBAC) is implemented with three roles:
- OWNER
- MANAGER
- STAFF

Permissions are enforced on both backend APIs and frontend UI.
Buttons like Add/Delete are hidden if the user does not have access.

## Data Modeling
Main collections:
- Users
- Suppliers
- Products
- Orders

Each collection contains:
- tenantId
- isDeleted (soft delete flag)

Records are never permanently deleted.

## Soft Delete
Instead of deleting data, `isDeleted: true` is set.
All list and count APIs filter data using `isDeleted: false`.

## Product Variants
Product variants are stored inside the Product document.
This avoids extra queries and improves read performance.

## Concurrency Handling
Stock updates use atomic MongoDB operations.
This prevents race conditions and overselling when multiple users place orders.

## Performance
- Indexed tenantId
- Parallel DB calls using Promise.all
- Pagination for listing APIs

## Scalability
- Supports unlimited tenants
- Stateless APIs
- Can scale horizontally
