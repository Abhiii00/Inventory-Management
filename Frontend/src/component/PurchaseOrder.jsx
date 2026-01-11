import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import { Button, Modal, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getAuthUser } from "../utils/auth";

import {
  supplierList,
  addPurchaseOrder,
  purchaseOrderList,
  updatePurchaseOrderStatus,
  receivePurchaseOrder,
  productsList
} from "../Action/action";

export default function PurchaseOrder() {
  const authUser = getAuthUser();
  const canCreate = authUser && (authUser.role === "OWNER" || authUser.role === "MANAGER");

  const [loader, setLoader] = useState(false);
  const [poData, setPoData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [viewItems, setViewItems] = useState([]);

  const [form, setForm] = useState({ supplierId: "" });
  const [items, setItems] = useState([{ sku: "", qty: "", price: "" }]);
  const [errors, setErrors] = useState({});

  /* ================= FETCH ================= */
  const fetchSuppliers = async () => {
    try {
      const res = await supplierList();
      if (res?.success) setSuppliers(res.data);
    } catch (err) {
      console.error("Supplier fetch failed");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productsList();
      if (res?.success) setProducts(res.data);
    } catch (err) {
      console.error("Product fetch failed");
    }
  };

  const fetchPO = async () => {
    try {
      setLoader(true);
      const res = await purchaseOrderList();
      if (res?.success) setPoData(res.data);
    } catch (err) {
      console.error("PO fetch failed");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchPO();
  }, []);

  /* ================= ITEM HANDLERS ================= */
  const addItemRow = () =>
    setItems([...items, { sku: "", qty: "", price: "" }]);

  const removeItemRow = (index) => {
    const temp = [...items];
    temp.splice(index, 1);
    setItems(temp);
  };

  const handleItemChange = (index, field, value) => {
    const temp = [...items];
    temp[index][field] = value;
    setItems(temp);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let temp = {};

    if (!form.supplierId) temp.supplierId = "Supplier required";

    items.forEach((i, idx) => {
      if (!i.sku) temp[`sku${idx}`] = "SKU required";
      if (!i.qty) temp[`qty${idx}`] = "Qty required";
      if (!i.price) temp[`price${idx}`] = "Price required";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoader(true);

      const payload = {
        supplierId: form.supplierId,
        items: items.map(i => ({
          sku: i.sku,
          qty: Number(i.qty),
          price: Number(i.price)
        }))
      };

      const res = await addPurchaseOrder(payload);

      if (res?.success) {
        Swal.fire("Success", "Purchase order created", "success");
        setShowModal(false);
        setForm({ supplierId: "" });
        setItems([{ sku: "", qty: "", price: "" }]);
        fetchPO();
      } else {
        Swal.fire("Error", res?.message || "Failed to create PO", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoader(false);
    }
  };

  /* ================= STATUS ================= */
  const changeStatus = async (id, status) => {
    try {
      const res = await updatePurchaseOrderStatus(id, { status });
      if (res?.success) fetchPO();
    } catch {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  const receivePO = (id) => {
    Swal.fire({
      title: "Receive Purchase Order?",
      text: "Stock will be updated",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Receive"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await receivePurchaseOrder(id);
          if (res?.success) {
            Swal.fire("Success", "Stock updated", "success");
            fetchPO();
          }
        } catch {
          Swal.fire("Error", "Failed to receive PO", "error");
        }
      }
    });
  };

  /* ================= TABLE ================= */
  const columns = [
    { name: "#", selector: (r, i) => i + 1, width: "60px" },
    { name: "Supplier", selector: r => r.supplierName },
    {
      name: "Items",
      cell: r => (
        <Button size="sm" onClick={() => { setViewItems(r.items); setShowItemsModal(true); }}>
          View
        </Button>
      )
    },
    { name: "Status", selector: r => r.status, center: true },
    {
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
      width: "140px",
      center: true,
    },
    {
      name: "Updated At",
      selector: (row) =>
        row.createdAt ? new Date(row.updatedAt).toLocaleDateString() : "-",
      width: "140px",
      center: true,
    },
    {
      name: "Action",
      cell: r => (
        <>
          {r.status === "DRAFT" && <Button size="sm" onClick={() => changeStatus(r._id, "SENT")}>Send</Button>}
          {r.status === "SENT" && <Button size="sm" onClick={() => changeStatus(r._id, "CONFIRMED")}>Confirm</Button>}
          {r.status === "CONFIRMED" && <Button size="sm" variant="success" onClick={() => receivePO(r._id)}>Receive</Button>}
          -
        </>
      )
    }
  ];

  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <section className="content">
            <div className="box">
              <div className="box-header d-flex justify-content-between">
                <h4>Purchase Orders</h4>
                {canCreate && <Button onClick={() => setShowModal(true)}>+ Add PO</Button>}
              </div>

              <div className="box-body">
                {!loader ? <DataTable columns={columns} data={poData} pagination dense /> : <center><i className="fa fa-spinner fa-spin"></i></center>}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>

      {/* ADD PO MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Add Purchase Order</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Select value={form.supplierId} onChange={e => setForm({ supplierId: e.target.value })}>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </Form.Select>
            <small className="text-danger">{errors.supplierId}</small>

            <hr />

            {items.map((item, idx) => (
              <div key={idx} className="border p-2 mb-2">
                <Form.Select value={item.sku} onChange={e => handleItemChange(idx, "sku", e.target.value)}>
                  <option value="">Select SKU</option>
                  {products.flatMap(p => p.variants.map(v => (
                    <option key={v.sku} value={v.sku}>{p.name} - {v.sku}</option>
                  )))}
                </Form.Select>
                <Form.Control className="mt-2" type="number" placeholder="Qty" value={item.qty} onChange={e => handleItemChange(idx, "qty", e.target.value)} />
                <Form.Control className="mt-2" type="number" placeholder="Price" value={item.price} onChange={e => handleItemChange(idx, "price", e.target.value)} />
                {items.length > 1 && <Button variant="danger" size="sm" className="mt-2" onClick={() => removeItemRow(idx)}>Remove</Button>}
              </div>
            ))}

            <Button variant="secondary" onClick={addItemRow}>+ Add Item</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Create PO</Button>
        </Modal.Footer>
      </Modal>

      {/* VIEW ITEMS MODAL */}
      <Modal show={showItemsModal} onHide={() => setShowItemsModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Purchase Items</Modal.Title></Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead><tr><th>SKU</th><th>Ordered</th><th>Received</th><th>Price</th></tr></thead>
            <tbody>
              {viewItems.map((i, idx) => (
                <tr key={idx}><td>{i.sku}</td><td>{i.qty}</td><td>{i.receivedQty || 0}</td><td>{i.price}</td></tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}
