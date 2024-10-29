import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSale } from "../../redux/slices/authSlice"; // Cập nhật đường dẫn tùy thuộc vào cấu trúc dự án của bạn
import { Form, Input, Button, Typography, message } from "antd";
import styled, { createGlobalStyle } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import * as UserService from "../../services/UserService";

const { Title } = Typography;

const GlobalStyle = createGlobalStyle`
  body, html {
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7f7f7; /* Màu nền của trang */
  }
`;

const LoginPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Khởi tạo navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => UserService.loginEmployee(data),
    onSuccess: (data) => {
      if (data.status === "OK") {
        if (data.user.status === true) {
          message.success("Đăng nhập thành công");
          // Lưu accessToken và refreshToken vào localStorage
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.user)); // Lưu user vào localStorage
          dispatch(loginSale(data.user)); // Gửi thông tin user vào Redux
          form.resetFields(); // Reset lại form
          // Điều hướng tới trang admin
          if (data.user.role === "admin") {
            navigate("/admin");
          }
          else if (data.user.role === "sales")
          {
            navigate("/sale");
          }
        } else {
          message.warning("Tài khoản không hoạt động");
        }
      } else {
        message.error(data.message);
      }
    },
    onError: (error) => {
      message.error(error.message || "Đăng nhập thất bại");
    },
  });

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        email,
        password,
      });
      // Reset các giá trị email và password
      setEmail(""); // Reset email
      setPassword(""); // Reset password
    } catch (error) {
      message.error(error.message || "Đăng nhập thất bại");
    }
  };
  console.log(localStorage.getItem("refreshToken"));
  return (
    <>
      <GlobalStyle />
      <LoginContainer>
        <Title level={2} style={{ color: "#5B3F20" }}>
          Đăng Nhập
        </Title>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            autoComplete="email" // Thêm thuộc tính autocomplete cho email
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Mật Khẩu"
            name="password"
            autoComplete="current-password" // Thêm thuộc tính autocomplete ở đây
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" block>
              Đăng Nhập
            </StyledButton>
          </Form.Item>
        </Form>
      </LoginContainer>
    </>
  );
};

// Styled-components
const LoginContainer = styled.div`
  display: flex; /* căn giữa */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto; /* Chiều cao */
  width: 500px; /* Chiều rộng cố định */
  margin: auto; /* Căn giữa trang */
  padding: 40px;
  border-radius: 10px; /* Bo góc */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  transition: all 0.3s ease; /* Thêm hiệu ứng khi hover */
  background-color: #fff7ed;
  &:hover {
    transform: translateY(-5px); /* Hiệu ứng di chuyển khi hover */
  }
`;

const StyledButton = styled(Button)`
  background-color: #5b3724; /* Màu nền cho nút */
  border-color: #5b3724; /* Màu viền cho nút */
  color: white; /* Màu chữ cho nút */
  &:hover,
  &:focus {
    background-color: #7a4a3c; /* Màu nền khi hover hoặc focus */
    border-color: #5b3724; /* Màu viền khi hover hoặc focus */
    color: white; /* Màu chữ khi hover hoặc focus */
  }
`;

export default LoginPage;
