import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isAdmin: false,
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
    loadUserFromStorage: (state) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";

      if (user && isAuthenticated) {
        state.user = user;
        state.isAdmin = isAdmin;
        state.isAuthenticated = true;
      } else {
        // Đảm bảo rằng nếu không có thông tin từ localStorage, trạng thái sẽ được reset
        state.user = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { loginAdmin, logoutAdmin, loadUserFromStorage } =
  authSlice.actions;
export default authSlice.reducer;
