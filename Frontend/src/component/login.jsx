import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { login } from "../Action/action";
import Cookies from "js-cookie";
import config from "../coreFIles/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eyelogin, seteyelogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const loginData = Cookies.get("Inventory_Management");

  // Redirect if already logged in
  useEffect(() => {
    if (loginData) {
      window.location.href = `${config.baseUrl}dashboard`;
    }
  }, [loginData]);

  // Simple validation
  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = { email, password };
      const res = await login(payload);

      if (res?.success) {
        toast.success(res.msg || "Login successful");

        Cookies.set("Inventory_Token", res.data.token, { expires: 1 });

        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("role", res.data.role);

        Cookies.set(
          "Inventory_Management",
          JSON.stringify(res.data),
          { expires: 1 }
        );

        setTimeout(() => {
          if (res.data.role === "OWNER") {
            navigate(`${config.baseUrl}dashboard`);
          }
          else if (res.data.role === "MANAGER") {
            navigate(`${config.baseUrl}dashboard`);
          }
          else if (res.data.role === "STAFF") {
            navigate(`${config.baseUrl}dashboard`);
          }
          else {
            navigate("/403");
          }
        }, 2000);

      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        toastStyle={{ backgroundColor: "#010000", color: "#fff" }}
      />

      <div className="position-relative bg-img" style={{ height: "100vh" }}>
        <div className="mask"></div>

        <div className="hold-transition theme-primary">
          <div className="container h-p100">
            <div className="row align-items-center justify-content-md-center h-p100">
              <div className="col-12">
                <div className="row justify-content-center g-0">
                  <div className="col-lg-5 col-md-5 col-12">
                    <div className="shadow-lg admin-login">

                      <div className="content-top-agile p-20 pb-0">
                        <h2 className="text-white">Inventory </h2>
                        <p className="mb-0">
                          Sign in to continue to Inventory
                        </p>
                      </div>

                      <div style={{ padding: "10px 40px 40px 40px" }}>
                        <form onSubmit={handleSubmit}>

                          {/* EMAIL */}
                          <div className="form-group text-start">
                            <label className="text-white mb-1">
                              Email
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && (
                              <div className="text-danger mt-1">
                                {errors.email}
                              </div>
                            )}
                          </div>

                          {/* PASSWORD */}
                          <div className="form-group text-start mt-3">
                            <label className="text-white mb-1">
                              Password
                            </label>

                            <div className="position-relative">
                              <input
                                type={eyelogin ? "password" : "text"}
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />

                              <button
                                type="button"
                                className="btn-link btn-sm position-absolute top-50 end-0 translate-middle-y bg-transparent border-0"
                                onClick={() => seteyelogin(!eyelogin)}
                                style={{ right: "10px", cursor: "pointer" }}
                              >
                                {eyelogin ? (
                                  <FaEyeSlash fill="gray" />
                                ) : (
                                  <FaEye fill="gray" />
                                )}
                              </button>
                            </div>

                            {errors.password && (
                              <div className="text-danger mt-1">
                                {errors.password}
                              </div>
                            )}

                            <button
                              type="submit"
                              className="btn btn-primary mt-15 w-100"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  Loading&nbsp;
                                  <span className="spinner-border spinner-border-sm"></span>
                                </>
                              ) : (
                                "SIGN IN"
                              )}
                            </button>

                          </div>
                        </form>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
