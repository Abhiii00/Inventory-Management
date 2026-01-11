import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import config from "./coreFIles/config";

import Login from "./component/login";
import UserList from "./component/UserList";
import Forbidden from "./component/Forbidden";
import Product from "./component/Product";
import Supplier from "./component/Supplier";
import PurchaseOrder from "./component/PurchaseOrder";
import Dashboard from "./component/Dashboard";
import StockMovement from "./component/StockMovement";

import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path={config.baseUrl} element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

        <Route
          path={`${config.baseUrl}dashboard`}
          element={
            <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "STAFF"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${config.baseUrl}user`}
          element={
            <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
              <UserList />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${config.baseUrl}products`}
          element={
            <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "STAFF"]}>
              <Product />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${config.baseUrl}suppliers`}
          element={
            <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "STAFF"]}>
              <Supplier />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${config.baseUrl}purchaseOrders`}
          element={
            <ProtectedRoute allowedRoles={["OWNER", "MANAGER",]}>
              <PurchaseOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${config.baseUrl}stockMovement`}
          element={
            <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "STAFF"]}>
              <StockMovement />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
