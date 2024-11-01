import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URI, // URL API
});

// Hàm để làm mới token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.error("No refresh token found");
    return;
  }

  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URI}/user/refresh-token`,
      {},
      {
        headers: {
          token: `Bearer ${refreshToken}`, // Gửi refresh token trong header
        },
      }
    );

    // Lưu access token mới
    localStorage.setItem("accessToken", data.accessToken);
  } catch (error) {
    // Xử lý khi refresh token cũng hết hạn
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/sign-in"; // Điều hướng về trang đăng nhập
  }
};

// Thêm interceptor để gửi access token trong các yêu cầu
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.token = `Bearer ${token}`; // Gửi access token trong header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý token hết hạn
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là do token hết hạn (401) và yêu cầu chưa được thử lại
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu yêu cầu đã thử lại
      await refreshAccessToken(); // Làm mới access token
      // Cập nhật lại header Authorization cho yêu cầu gốc với access token mới
      const newToken = localStorage.getItem("accessToken");
      originalRequest.headers.token = `Bearer ${newToken}`;
      // Gửi lại yêu cầu gốc với token mới
      return instance(originalRequest);
    }
    return Promise.reject(error); // Nếu không phải 401, trả về lỗi
  }
);

setInterval(refreshAccessToken, 15 * 1000); // 15 giây

export default instance;
