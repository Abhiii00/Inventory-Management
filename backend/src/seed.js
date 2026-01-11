require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Tenant = require("../src/models/tenantModel");
const User = require("../src/models/userModel");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);


    const tenants = [
      {
        name: "Tenant 1",
        email: "tenant1@gmail.com",
        contact: "9876543210",
        address: "Bhopal, MP"
      },
      {
        name: "Tenant 2",
        email: "tenant2@gmail.com",
        contact: "9123456789",
        address: "Indore, MP"
      }
    ];

    const createdTenants = [];

    for (let i = 0; i < tenants.length; i++) {
      const tenantData = tenants[i];

      let tenant = await Tenant.findOne({
        $or: [
          { name: tenantData.name },
          { email: tenantData.email }
        ]
      });

      if (!tenant) {
        tenant = await Tenant.create(tenantData);
        console.log("Tenant created:", tenant.name);
      } else {
        console.log("Tenant already exists:", tenant.name);
      }

      createdTenants.push(tenant);
    }

    const passwordHash = await bcrypt.hash("123456", 10);

    const users = [
      {
        tenantIndex: 0,
        name: "Admin",
        email: "admin1@gmail.com",
        role: "OWNER"
      },
      {
        tenantIndex: 1,
        name: "Admin",
        email: "admin2@gmail.com",
        role: "OWNER"
      }
    ];

    for (let i = 0; i < users.length; i++) {
      const userData = users[i];

      let user = await User.findOne({
        email: userData.email,
        tenantId: createdTenants[userData.tenantIndex]._id
      });

      if (!user) {
        user = await User.create({
          tenantId: createdTenants[userData.tenantIndex]._id,
          name: userData.name,
          email: userData.email,
          password: passwordHash,
          role: userData.role
        });

        console.log("User created:", user.email);
      } else {
        console.log("User already exists:", user.email);
      }
    }

    console.log("Seed completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
