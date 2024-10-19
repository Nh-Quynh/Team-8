import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { loadUserFromStorage } from "./redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux"; // Import thêm useSelector
import ProtectedRoute from "./routes/ProtectedRoute"; // Import ProtectedRoute

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth); // Lấy trạng thái xác thực từ Redux
  const [loading, setLoading] = useState(true); // Trạng thái để kiểm soát khi đang tải thông tin người dùng

  useEffect(() => {
    console.log("Loading user from localStorage...");
    dispatch(loadUserFromStorage());
    setLoading(false); // Dừng loading sau khi đã tải thông tin
  }, [dispatch]);

  // Hiển thị màn hình loading khi đang tải dữ liệu người dùng
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.requiresAuth ? (
                    <ProtectedRoute
                      page={Page}
                      requiresAuth={route.requiresAuth}
                    />
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
