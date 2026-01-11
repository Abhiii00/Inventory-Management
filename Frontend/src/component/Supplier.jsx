import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { addSupplier, supplierList, deleteSupplier } from "../Action/action";
import { getAuthUser } from "../utils/auth";

export default function Supplier() {
  const authUser = getAuthUser();
  const canCreate = authUser && (authUser.role === "OWNER" || authUser.role === "MANAGER");
  const canDelete = authUser && authUser.role === "OWNER";

  const [loader, setLoader] = useState(false);
  const [supplierData, setSupplierData] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  // ================= FETCH SUPPLIERS =================
  const fetchSuppliers = async () => {
    try {
      setLoader(true);
      const res = await supplierList();
      if (res.success) {
        setSupplierData(res.data);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    let temp = { name: "", email: "", contact: "", address: "" };
    let valid = true;

    if (!form.name.trim()) {
      temp.name = "Supplier name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      temp.email = "Email is required";
      valid = false;
    }

    if (!form.contact.trim()) {
      temp.contact = "Contact number is required";
      valid = false;
    }

    if (!form.address.trim()) {
      temp.address = "Address is required";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  // ================= OPEN ADD MODAL =================
  const openAddModal = () => {
    setForm({
      name: "",
      email: "",
      contact: "",
      address: "",
    });
    setErrors({
      name: "",
      email: "",
      contact: "",
      address: "",
    });
    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoader(true);

      const payload = {
        name: form.name,
        email: form.email,
        contact: form.contact,
        address: form.address,
      };

      const res = await addSupplier(payload);

      if (res.success) {
        Swal.fire("Success", "Supplier added successfully", "success");
        setShowModal(false);
        setForm({
          name: "",
          email: "",
          contact: "",
          address: "",
        });
        setErrors({
          name: "",
          email: "",
          contact: "",
          address: "",
        });
        fetchSuppliers();
      } else {
        Swal.fire("Error", res.message || "Failed to add supplier", "error");
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

    const handleDelete = (id, name) => {
    Swal.fire({
      title: "Delete Supplier?",
      text: `Are you sure you want to delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteSupplier(id);
          if (res.success) {
            Swal.fire("Deleted", "Supplier deleted successfully", "success");
            fetchSuppliers();
          } else {
            Swal.fire("Error", res.message, "error");
          }
        } catch {
          Swal.fire("Error", "Failed to delete supplier", "error");
        }
      }
    });
  };

  // ================= TABLE COLUMNS =================
const columns = [
    { name: "#", selector: (_, i) => i + 1, width: "60px", center: true },
    { name: "Supplier Name", selector: r => r.name, sortable: true, grow: 2 },
    { name: "Contact", selector: r => r.contact, width: "150px", center: true },
    { name: "Email", selector: r => r.email, grow: 2 },
    { name: "Address", selector: r => r.address, grow: 2 },
    {
      name: "Created At",
      selector: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-",
      width: "130px",
      center: true,
    },
    canDelete && {
      name: "Action",
      center: true,
      cell: r => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(r._id, r.name)}
        >
          Delete
        </Button>
      ),
    },
  ].filter(Boolean);
  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <section className="content">
            <div className="box">
              <div className="box-header with-border d-flex justify-content-between">
                <h4 className="box-title">Supplier List</h4>
                {canCreate && (
                <Button className="btn btn-primary" onClick={openAddModal}>
                  + Add Supplier
                </Button>
                )}
              </div>

              <div className="box-body">
                {!loader ? (
                  <DataTable
                    columns={columns}
                    data={supplierData}
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

      {/* ================= MODAL ================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Supplier</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
              {errors.contact && (
                <small className="text-danger">{errors.contact}</small>
              )}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Supplier
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
