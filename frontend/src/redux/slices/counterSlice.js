import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  formattedDate: "", // Thêm thuộc tính lưu ngày đã format
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    setFormattedDate: (state, action) => {
      const isoDate = action.payload; // Chuỗi ngày ISO
      const dateOnly = isoDate.split("T")[0]; // Lấy phần trước 'T'
      const [year, month, day] = dateOnly.split("-"); // Tách thành các phần năm, tháng, ngày
      state.formattedDate = `${day}/${month}/${year}`; // Gán chuỗi ngày đã format
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
