import config from "../coreFIles/config";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { logout as apiLogout } from "../Action/action";

const Sidebar = () => {
  const pageUrl = window.location.pathname;

  const userData = Cookies.get("Inventory_Management")
    ? JSON.parse(Cookies.get("Inventory_Management"))
    : null;

  const role = userData?.role;

  const handleLogout = async () => {
    try {

      const loginData = Cookies.get("Inventory_Management")
        ? JSON.parse(Cookies.get("Inventory_Management"))
        : null;

      if (loginData?.refreshToken) {
        await apiLogout({ refreshToken: loginData.refreshToken });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      Cookies.remove("Inventory_Management");
      Cookies.remove("Inventory_Token");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = config.baseUrl;
    }
  };

  return (
    <aside className="main-sidebar">
      <section className="sidebar position-relative">
        <div className="multinav">
          <div className="multinav-scroll pt-10" style={{ height: "100%" }}>
            <ul className="sidebar-menu" data-widget="tree">

              <li className={pageUrl.includes("/dashboard") ? "active" : ""}>
                <Link to={`${config.baseUrl}dashboard`}>
                  <i className="fa fa-dashboard" />
                  <span>DASHBOARD 123</span>
                </Link>
              </li>

              {(role === "OWNER" || role === "MANAGER") && (
                <li className={pageUrl.includes("/user") ? "active" : ""}>
                  <Link to={`${config.baseUrl}user`}>
                    <i className="fa fa-users" />
                    <span>USERS</span>
                  </Link>
                </li>
              )}

              {(role === "OWNER" || role === "MANAGER" || role === "STAFF") && (
                <li className={pageUrl.includes("/products") ? "active" : ""}>
                  <Link to={`${config.baseUrl}products`}>
                    <i className="fa fa-cube" />
                    <span>PRODUCTS</span>
                  </Link>
                </li>
              )}

              {(role === "OWNER" || role === "MANAGER" || role === "STAFF") && (
                <li className={pageUrl.includes("/suppliers") ? "active" : ""}>
                  <Link to={`${config.baseUrl}suppliers`}>
                    <i className="fa fa-truck" />
                    <span>SUPPLIERS</span>
                  </Link>
                </li>
              )}

              {(role === "OWNER" || role === "MANAGER") && (
                <li className={pageUrl.includes("/purchaseOrders") ? "active" : ""}>
                  <Link to={`${config.baseUrl}purchaseOrders`}>
                    <i className="fa fa-shopping-cart" />
                    <span>PURCHASE ORDERS</span>
                  </Link>
                </li>
              )}

              {(role === "OWNER" || role === "MANAGER" || role === "STAFF") && (
                <li className={pageUrl.includes("/stockMovement") ? "active" : ""}>
                  <Link to={`${config.baseUrl}stockMovement`}>
                    <i className="fa fa-exchange" />
                    <span>STOCK MOVEMENT</span>
                  </Link>
                </li>
              )}

              <li>
                <a href="#" onClick={handleLogout}>
                  <i className="fa fa-sign-out" />
                  <span>LOGOUT</span>
                </a>
              </li>

            </ul>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
