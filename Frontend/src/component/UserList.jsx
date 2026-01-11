import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { userList, createUser, deleteUser } from "../Action/action";
import { getAuthUser } from "../utils/auth";

export default function UserList() {
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  
  const authUser = getAuthUser();
  const isOwner = authUser && authUser.role === "OWNER";



  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // ================= FETCH USER LIST =================
  const fetchUsers = async () => {
    try {
      setLoader(true);
      const res = await userList();
      if (res.success) {
        setUserData(res.data);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    let temp = { name: "", email: "", password: "", role: "" };
    let valid = true;

    if (!form.name.trim()) {
      temp.name = "Name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      temp.email = "Email is required";
      valid = false;
    }

    if (!form.password.trim()) {
      temp.password = "Password is required";
      valid = false;
    }

    if (!form.role.trim()) {
      temp.role = "Role is required";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  // ================= OPEN ADD MODAL =================
  const openAddModal = () => {
    setModalType("add");
    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setErrors({
      name: "",
      email: "",
      password: "",
      role: "",
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
        password: form.password,
        role: form.role,
      };

      const res = await createUser(payload);

      if (res.success) {
        Swal.fire("Success", "User created successfully", "success");
        setShowModal(false);
        setForm({ name: "", email: "", password: "", role: "" });
        setErrors({ name: "", email: "", password: "", role: "" });
        fetchUsers();
      } else {
        Swal.fire("Error", res.message || "User creation failed", "error");
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

   const handleDelete = (userId, name) => {
    if (authUser.id === userId) {
      Swal.fire("Warning", "You cannot delete your own account", "warning");
      return;
    }

    Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteUser(userId);
          if (res.success) {
            Swal.fire("Deleted", "User deleted successfully", "success");
            fetchUsers();
          } else {
            Swal.fire("Error", res.message, "error");
          }
        } catch {
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };


   const columns = [
    { name: "#", selector: (_, i) => i + 1, width: "70px", center: true },
    { name: "Name", selector: r => r.name, sortable: true },
    { name: "Email", selector: r => r.email, sortable: true },
    { name: "Role", selector: r => r.role, center: true },

    isOwner && {
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
                <h4 className="box-title">User List</h4>
                {isOwner && (
                  <Button className="btn btn-primary" onClick={openAddModal}>
                    + Add User
                  </Button>
                )}

              </div>

              <div className="box-body">
                {!loader ? (
                  <DataTable
                    columns={columns}
                    data={userData}
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
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                <option value="OWNER">OWNER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="STAFF">STAFF</option>
              </Form.Select>
              {errors.role && (
                <small className="text-danger">{errors.role}</small>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
