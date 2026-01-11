import {
  getRequest,
  postRequest,
  PatchRequest,
  deleteRequest,
  putRequest,
} from "../coreFIles/helper";

//------------------|| USER AUTH ||------------------//

export const login = async (data) => {
  const res = await postRequest("auth/login", data);
  return res;
};

export const refreshToken = async (data) => {
  const res = await postRequest("auth/refreshToken", data);
  return res;
};

export const logout = async (data) => {
  const res = await postRequest("auth/logout", data);
  return res;
};

export const userList = async (data) => {
  const res = await getRequest("userList", data);
  return res;
};

export const createUser = async (data) => {
  const res = await postRequest("createUser", data);
  return res;
};

export const deleteUser = async (userId) => {
  const res = await deleteRequest(`deleteUser/${userId}`,);
  return res;
};

export const deleteProduct = async (id) => {
  const res = await deleteRequest(`deleteProduct/${id}`,);
  return res;
};

export const productsList = async (data) => {
  const res = await getRequest("productList", data);
  return res;
};

export const addProduct = async (data) => {
  const res = await postRequest("addProducts", data);
  return res;
};

export const supplierList = async (data) => {
  const res = await getRequest("supplierList", data);
  return res;
};

export const addSupplier = async (data) => {
  const res = await postRequest("addSupplier", data);
  return res;
};

export const deleteSupplier = async (id) => {
  const res = await deleteRequest(`deleteSupplier/${id}`,);
  return res;
};

export const addPurchaseOrder = async (data) => {
  const res = await postRequest("addPurchaseOrder", data);
  return res;
};

export const purchaseOrderList = async () => {
  const res = await getRequest("purchaseOrderList");
  return res;
};

export const updatePurchaseOrderStatus = async (id, data) => {
  const res = await putRequest(`updateStatus/${id}`, data);
  return res;
};

export const receivePurchaseOrder = async (id) => {
  const res = await putRequest(`receivePurchaseOrder/${id}`);
  return res;
};

export const dashboardCounts = async () => {
  const res = await getRequest("dashboardCounts");
  return res;
};

export const orderStatusStats = async () => {
  const res = await getRequest("orderStatusStats");
  return res;
};

export const topSuppliers = async () => {
  const res = await getRequest("topSuppliers");
  return res;
};

export const stockMovements = async () => {
  const res = await getRequest("stockMovements");
  return res;
};

export const lowStockList = async () => {
  const res = await getRequest("lowStockList");
  return res;
};

