import Cookies from "js-cookie";

export const getAuthUser = () => {
  const user = Cookies.get("Inventory_Management");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!Cookies.get("Inventory_Token");
};

export const getUserRole = () => {
  const user = getAuthUser();
  return user?.role || null;
};
