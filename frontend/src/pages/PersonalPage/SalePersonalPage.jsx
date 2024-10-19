import React from "react";
import styled from "styled-components";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import InfoCard from "./InfoCard";
import SaleNavComponent from "../../components/NavComponent/SaleNavComponent";
import SaleInfoCard from "./SalePersonalCard";

const SalePersonalPage = () => {
  return (
    <PageContainer>
      <SaleNavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          <CenteredContainer>
            <Title>Thông tin cá nhân</Title> {/* Thêm tiêu đề ở đây */}
            <SaleInfoCard />
          </CenteredContainer>
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default SalePersonalPage;

// Styled components
const PageContainer = styled.div`
  display: flex; /* Sử dụng flexbox để sắp xếp các thành phần */
  height: 100vh; /* Đảm bảo chiều cao của container chiếm toàn bộ màn hình */
`;

const MainContainer = styled.div`
  flex: 1; /* Chiếm phần còn lại của màn hình */
  margin-left: 300px; /* Bằng chiều rộng của nav */
`;

const ContentContainer = styled.div`
  padding: 10px; /* Khoảng cách cho nội dung */
  padding-top: 20px; /* Khoảng cách từ header */
  display: flex; /* Sử dụng flexbox để căn giữa */
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  height: calc(100vh - 60px); /* Chiều cao tính từ header */
`;

const CenteredContainer = styled.div`
  border-radius: 10px;
  background-color: #fff7ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 60%; /* Chiếm 1/2 chiều cao của màn hình */
  width: 100%; /* Chiều rộng đầy đủ */
  max-width: 1200px; /* Giới hạn chiều rộng tối đa */
  display: flex; /* Sử dụng flexbox để căn giữa card */
  flex-direction: column; /* Chuyển đổi chiều flex thành cột để chứa tiêu đề và card */
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  padding: 20px; /* Khoảng cách bên trong để giữ cho các thành phần không chạm vào viền */
`;

const Title = styled.h2`
  margin-bottom: 20px; /* Khoảng cách dưới tiêu đề */
  font-size: 30px; /* Kích thước chữ */
  font-weight: bold; /* Đậm chữ */
  color: #333; /* Màu chữ */
  justify-content: center; /* Căn giữa theo chiều ngang */
`;
