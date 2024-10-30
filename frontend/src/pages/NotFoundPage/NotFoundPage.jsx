import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5; /* Màu nền sáng */
  text-align: center;
`;

const Title = styled.h1`
  font-size: 60px;
  color: #ff4d4f; /* Màu đỏ nổi bật */
`;

const Message = styled.p`
  font-size: 20px;
  color: #555; /* Màu chữ xám */
  margin: 20px 0;
`;

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/"); // Quay lại trang chính
  };

  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>Trang bạn tìm kiếm không tồn tại.</Message>
      <Button type="primary" onClick={handleBackHome}>
        Quay lại trang chính
      </Button>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
