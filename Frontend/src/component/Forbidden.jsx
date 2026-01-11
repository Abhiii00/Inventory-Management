import React from "react";
import Cookies from "js-cookie";
import config from "../coreFIles/config";

const Forbidden = () => {
  const logout = () => {
    Cookies.remove("Inventory_Management");
    window.location.href = config.baseUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>403 Forbidden</h1>
      <p>You do not have access to this page.</p>
      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default Forbidden;
