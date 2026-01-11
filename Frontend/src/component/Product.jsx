import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import { Button, Modal, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { productsList, addProduct, deleteProduct } from "../Action/action";
import { getAuthUser } from "../utils/auth";


export default function Product() {
  const authUser = getAuthUser();
  const canCreate = authUser && (authUser.role === "OWNER" || authUser.role === "MANAGER");
    const canDelete = authUser && authUser.role === "OWNER";


  const [loader, setLoader] = useState(false);
  const [productData, setProductData] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);

  const [form, setForm] = useState({
    name: "",
    variants: [{ sku: "", price: "", stock: "" }],
  });

  const [errors, setErrors] = useState({
    name: "",
    variants: [],
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoader(true);
      const res = await productsList();
      if (res.success) {
        setProductData(res.data);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    let valid = true;
    let tempErrors = { name: "", variants: [] };

    if (!form.name.trim()) {
      tempErrors.name = "Product name is required";
      valid = false;
    }

    form.variants.forEach((variant, index) => {
      let variantError = {};

      if (!variant.sku.trim()) {
        variantError.sku = "SKU is required";
        valid = false;
      }

      if (!variant.price || variant.price <= 0) {
        variantError.price = "Valid price required";
        valid = false;
      }

      if (variant.stock === "" || variant.stock < 0) {
        variantError.stock = "Valid stock required";
        valid = false;
      }

      tempErrors.variants[index] = variantError;
    });

    setErrors(tempErrors);
    return valid;
  };

  // ================= VARIANT HANDLERS =================
  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { sku: "", price: "", stock: "" }],
    });
  };

  const removeVariant = (index) => {
    const updated = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants: updated });
  };

  // ================= ADD PRODUCT =================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoader(true);

      const payload = {
        name: form.name,
        variants: form.variants.map((v) => ({
          sku: v.sku,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };

      const res = await addProduct(payload);

      if (res.success) {
        Swal.fire("Success", "Product added successfully", "success");
        setShowAddModal(false);
        setForm({ name: "", variants: [{ sku: "", price: "", stock: "" }] });
        setErrors({ name: "", variants: [] });
        fetchProducts();
      } else {
        Swal.fire("Error", res.message || "Failed to add product", "error");
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ================= VIEW VARIANTS =================
  const openVariantModal = (variants) => {
    setSelectedVariants(variants);
    setShowVariantModal(true);
  };


    const handleDelete = (productId, productName) => {
    Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${productName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteProduct(productId);
          if (res.success) {
            Swal.fire("Deleted", "Product deleted successfully", "success");
            fetchProducts();
          } else {
            Swal.fire("Error", res.message, "error");
          }
        } catch {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { name: "#", selector: (_, i) => i + 1, width: "60px", center: true },
    { name: "Product Name", selector: r => r.name, sortable: true },
    {
      name: "Variants",
      center: true,
      cell: r => (
        <Button size="sm" variant="info" onClick={() => openVariantModal(r.variants)}>
          View ({r.variants.length})
        </Button>
      ),
    },
    {
      name: "Created At",
      selector: r => new Date(r.createdAt).toLocaleDateString(),
      width: "130px",
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
                <h4 className="box-title">Product List</h4>
                {canCreate && (
                <Button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  + Add Product
                </Button>
                )}
              </div>

              <div className="box-body">
                {!loader ? (
                  <DataTable
                    columns={columns}
                    data={productData}
                    pagination
                    dense
                    responsive
                    highlightOnHover
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

      {/* ================= ADD PRODUCT MODAL ================= */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </Form.Group>

            <hr />
            <h6>Variants</h6>

            {form.variants.map((variant, index) => (
              <div key={index} className="border p-3 mb-2 rounded">
                <Form.Group>
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                  />
                  {errors.variants[index]?.sku && (
                    <small className="text-danger">{errors.variants[index].sku}</small>
                  )}
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                  />
                  {errors.variants[index]?.price && (
                    <small className="text-danger">{errors.variants[index].price}</small>
                  )}
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
                    }
                  />
                  {errors.variants[index]?.stock && (
                    <small className="text-danger">{errors.variants[index].stock}</small>
                  )}
                </Form.Group>

                {form.variants.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => removeVariant(index)}
                  >
                    Remove Variant
                  </Button>
                )}
              </div>
            ))}

            <Button variant="secondary" size="sm" onClick={addVariant}>
              + Add Variant
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= VIEW VARIANT MODAL ================= */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Variants</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {selectedVariants.map((variant, index) => (
                <tr key={variant._id || index}>
                  <td>{index + 1}</td>
                  <td>{variant.sku}</td>
                  <td>₹ {variant.price}</td>
                  <td>{variant.stock}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
