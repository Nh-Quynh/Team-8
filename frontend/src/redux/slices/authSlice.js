import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  isSale: false,
  isStatus: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.isAuthenticated = true;
      state.isAdmin = true;
      state.user = action.payload;
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isAuthenticated", "true");
    },
    logoutAdmin: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isAuthenticated");
    },
    loginSale: (state, action) => {
      state.isAuthenticated = true;
      state.isSale = true;
      state.user = action.payload;
      state.isStatus = action.payload.status;
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isSale", "true");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isStatus", JSON.stringify(action.payload.status));
    },
    logoutSale: (state) => {
      state.user = null;
      state.isSale = false;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isSale");
      localStorage.removeItem("isAuthenticated");
    },
    getUser: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isSale", JSON.stringify(action.payload.role));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isStatus", JSON.stringify(action.payload.status)); // Lưu isStatus
      state.user = action.payload;
      state.isStatus = action.payload.status;
    },
    loadUserFromStorage: (state) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const isSale = localStorage.getItem("isSale") === "true";
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      const isStatus = JSON.parse(localStorage.getItem("isStatus")); // Lấy isStatus từ localStorage

      if (user && isAuthenticated) {
        state.user = user;
        state.isSale = isSale;
        state.isAuthenticated = true;
        state.isStatus = isStatus ?? false; // Đặt giá trị mặc định là false nếu isStatus không tồn tại
      } else {
        // Đảm bảo rằng nếu không có thông tin từ localStorage, trạng thái sẽ được reset
        state.user = null;
        state.isSale = false;
        state.isAuthenticated = false;
        state.isStatus = false; // Reset isStatus
      }
    },
  },
});

export const { loginAdmin, logoutAdmin, loadUserFromStorage, loginSale, logoutSale, getUser } =
  authSlice.actions;
export default authSlice.reducer;
