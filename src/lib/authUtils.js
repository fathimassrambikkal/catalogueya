import { logout } from "../store/authSlice";
import { logoutCustomer, logoutCompany } from "../api";

export const performLogout = async (dispatch, navigate, userType) => {
  try {
    if (userType === "customer") {
      await logoutCustomer();
    } else if (userType === "company") {
      await logoutCompany();
    }
  } catch (error) {
    console.warn("Logout API failed, proceeding anyway");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");

    dispatch(logout());
    navigate("/");
  }
};
