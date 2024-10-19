import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ page: Page, requiresAuth }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  // Nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  // Nếu route yêu cầu quyền admin và người dùng không phải là admin
  if (requiresAuth && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  // Hiển thị trang tương ứng
  return <Page />;
};

export default ProtectedRoute;
