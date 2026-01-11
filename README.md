# Multi-Tenant Inventory Management System

## Description
This is a multi-tenant inventory management system built using
Node.js, Express, MongoDB, and React.

Each tenant has isolated data and role-based access control.

## Tech Stack
Backend:
- Node.js
- Express.js
- MongoDB
- JWT

Frontend:
- React
- React Bootstrap
- SweetAlert2

## Seed Tenant Data

Run the seed file to insert default tenants, users:
- npm install 
- npm node seed.js 

## Setup

Backend:
- npm install  
- npm node server.js 

Frontend:
- npm install  
- npm start  

## Environment Variables
PORT  
MONGO_URI  
JWT_SECRET  

## Test Credentials

Tenant 1:
- OWNER - admin1@gmail.com / 123456 
- MANAGER - abhay@gmail.com / 123456
- STAFF - ajay@gmail.com / 123456

Tenant 2:
- OWNER - admin2@gmail.com / 123456  

## Features
- Multi-tenant architecture
- JWT authentication
- Auto Refresh Token
- Role based access control
- User management
- Supplier management
- Product & variants
- Soft delete support
- Dashboard counts
- Frontend permission handling

## Assumptions
- One tenant per user
- One role per user
- Soft delete is used instead of permanent delete


## Role-Based Access Control (RBAC)

The system uses role-based permissions to control access.

Owner:

Full platform access
Can view, add, edit, and delete all data

Access to:
- Dashboard & analytics
- User management
- Suppliers
- Products
- Purchase Orders
- Stock Updates

Can manage users and assign roles

Manager:

Access to all modules
Can view and add data
Cannot delete any data

Access includes:
- Dashboard
- View user list (no create/delete)
- Suppliers
- Products
- Purchase Orders
- Stock Updates


Staff:

Limited, read-only access
Can only view data
Cannot add, edit, or delete

Access includes:

- Dashboard
- View-only lists (Products, Suppliers, Stock Updates)


If you face any issues during installation or need further explanation, feel free to connect with me.