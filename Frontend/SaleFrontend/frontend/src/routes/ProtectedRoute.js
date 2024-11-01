import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { message } from "antd";
import { logoutAdmin, logoutSale } from "../redux/slices/authSlice";

const ProtectedRoute = ({
  page: Page,
  requiresAuth,
  requiresAdmin,
  requiresSales,
  requiresStatus,
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin, isSale, isStatus } = useSelector(
    (state) => state.auth
  );
  const hasShownMessage = useRef(false); // Cờ kiểm soát thông báo

  // Kiểm tra trạng thái tài khoản
  if (requiresStatus && !isStatus) {
    if (!hasShownMessage.current && isAuthenticated) {
      // Thêm điều kiện kiểm tra isAuthenticated
      message.error("Tài khoản của bạn đã bị khóa.");
      hasShownMessage.current = true; // Đặt cờ để ngăn hiển thị lại
    }

    dispatch(logoutAdmin());
    dispatch(logoutSale());
    return <Navigate to="/sign-in" replace />;
  }

  // Kiểm tra trạng thái đăng nhập và quyền
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (requiresSales && !isSale) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Hiển thị trang nếu tất cả điều kiện đều thỏa mãn
  return <Page />;
};

export default ProtectedRoute;
