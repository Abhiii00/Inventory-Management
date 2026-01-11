import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import { Link } from "react-router-dom";
import {
  dashboardCounts,
  orderStatusStats,
  topSuppliers,
  lowStockList
} from "../Action/action";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0
  });

  const [orderStats, setOrderStats] = useState({
    DRAFT: 0,
    SENT: 0,
    CONFIRMED: 0,
    RECEIVED: 0
  });

  const [topSupplierList, setTopSupplierList] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    getDashboardCounts();
    getOrderStatusStats();
    getTopSuppliers();
    getLowStockItems();
  }, []);

  const getDashboardCounts = async () => {
    try {
      const res = await dashboardCounts();
      if (res?.success) setDashboardStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getOrderStatusStats = async () => {
    try {
      const res = await orderStatusStats();
      if (res?.success) setOrderStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTopSuppliers = async () => {
    try {
      const res = await topSuppliers();
      if (res?.success) setTopSupplierList(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const getLowStockItems = async () => {
    try {
      const res = await lowStockList();
      if (res?.success) setLowStockItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <div className="container-full">

            {/* LOW STOCK SLIDING ALERT */}
            {lowStockItems.length > 0 && (
              <div
                style={{
                  background: "#c9302c",
                  color: "#fff",
                  padding: "10px 15px",
                  marginBottom: "15px",
                  fontWeight: "500",
                  borderRadius: "4px"
                }}
              >
                <marquee behavior="scroll" direction="left" scrollamount="6">
                  ⚠ LOW STOCK ALERT :{" "}
                  {lowStockItems.map((product) =>
                    product.variants.map((v) => (
                      <span key={v._id}>
                        {product.name} (SKU: {v.sku}, Stock: {v.stock}) •{" "}
                      </span>
                    ))
                  )}
                </marquee>
              </div>
            )}

            <div className="content-header mb-4">
              <h3 className="page-title pb-2 m-0">Dashboard</h3>
            </div>

            <section className="content pt-0">

              {/* MAIN COUNTS */}
              <div className="row mt-3">
                <StatBox title="Total Users" value={dashboardStats.totalUsers || 0} link="users" />
                <StatBox title="Total Suppliers" value={dashboardStats.totalSuppliers || 0} link="supplier-list" />
                <StatBox title="Total Products" value={dashboardStats.totalProducts || 0} link="product-list" />
                <StatBox title="Total Orders" value={dashboardStats.totalOrders || 0} link="order-list" />
              </div>

              {/* ORDER STATUS */}
              <div className="row mt-4">
                <StatBox title="Draft Orders" value={orderStats.DRAFT || 0} link="orders?status=DRAFT" />
                <StatBox title="Sent Orders" value={orderStats.SENT || 0} link="orders?status=SENT" />
                <StatBox title="Confirmed Orders" value={orderStats.CONFIRMED || 0} link="orders?status=CONFIRMED" />
                <StatBox title="Received Orders" value={orderStats.RECEIVED || 0} link="orders?status=RECEIVED" />
              </div>

              {/* TOP SUPPLIERS */}
              <div className="row mt-5">
                <div className="col-12">
                  <div className="box">
                    <div className="box-header">
                      <h4 className="box-title">Top 5 Suppliers</h4>
                    </div>

                    <div className="box-body table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Supplier Name</th>
                            <th>Total Orders</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topSupplierList.length > 0 ? (
                            topSupplierList.map((item, index) => (
                              <tr key={item.supplierId}>
                                <td>{index + 1}</td>
                                <td>{item.supplierName}</td>
                                <td>{item.totalOrders}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center">
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

const StatBox = ({ title, value, link }) => (
  <div className="col-lg-3 col-md-6 col-12 mt-2">
    <Link to={`${config.baseUrl}${link}`}>
      <div className="box">
        <div className="box-body text-center">
          <h5>{title}</h5>
          <h3 className="mt-2">{value}</h3>
        </div>
      </div>
    </Link>
  </div>
);

export default Dashboard;
