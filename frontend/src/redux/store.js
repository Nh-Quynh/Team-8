import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import authReducer from "./slices/authSlice"; // Nhập authReducer

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer, // Thêm reducer cho auth
  },
});
