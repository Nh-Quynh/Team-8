import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>Trang bạn tìm kiếm không tồn tại.</Message>
      <StyledLink to="/sale"> Quay lại trang chính</StyledLink>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff7ed;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 96px;
  margin-bottom: 24px;
  color: #ff6b6b;
`;

const Message = styled.p`
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
`;

const StyledLink = styled(Link)`
  font-size: 18px;
  color: #5b3724;
  text-decoration: none;
  border: 2px solid #755543;
  padding: 10px 20px;
  border-radius: 5px;
  transition: 0.3s ease;

  &:hover {
    background-color: #ada399;
    color: #fff;
  }
`;
