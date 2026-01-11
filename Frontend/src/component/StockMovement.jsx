import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { stockMovements } from "../Action/action";

export default function StockMovement() {
  const [loader, setLoader] = useState(false);
  const [stockData, setStockData] = useState([]);

  /* ================= FETCH STOCK MOVEMENTS ================= */
  const fetchStockMovements = async () => {
    try {
      setLoader(true);
      const res = await stockMovements();
      if (res.success) {
        setStockData(res.data);
      } else {
        Swal.fire("Error", res.message || "Failed to fetch stock movements", "error");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Stock movements fetch failed");
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "70px",
      center: true,
    },
    {
      name: "SKU",
      selector: (row) => row.sku || "-",
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.qty,
      sortable: true,
      center: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      center: true,
      cell: (row) => (
        <span className="badge badge-success">
          {row.type}
        </span>
      ),
    },
    {
      name: "Supplier",
      selector: (row) => row.supplierName || "-",
      sortable: true,
      grow: 2,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.createdAt).toLocaleString(),
      sortable: true,
      grow: 2,
    },
  ];

  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <section className="content">
            <div className="box">
              <div className="box-header with-border">
                <h4 className="box-title">Stock Movements</h4>
              </div>

              <div className="box-body">
                {!loader ? (
                  <DataTable
                    columns={columns}
                    data={stockData}
                    pagination
                    highlightOnHover
                    dense
                    responsive
                  />
                ) : (
                  <center>
                    <h4>
                      <i className="fa fa-spinner fa-spin"></i> Loading...
                    </h4>
                  </center>
                )}
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
