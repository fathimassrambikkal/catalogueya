import { logout } from "../store/authSlice";
import { logoutCustomer, logoutCompany } from "../api";
import { warn } from "../utils/logger";

export const performLogout = async (dispatch, navigate, userType) => {
  try {
    if (userType === "customer") {
      await logoutCustomer();
    } else if (userType === "company") {
      await logoutCompany();
    }
  } catch (err) {
    // Silent in prod, visible in dev
    warn("performLogout: logout API failed, proceeding anyway", err);
  } finally {
    // 🔐 Always clear local state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");

    dispatch(logout());
    navigate("/", { replace: true });
  }
};
