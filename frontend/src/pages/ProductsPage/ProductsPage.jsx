import React, { useState } from "react";
import styled from "styled-components";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import NavComponent from "../../components/NavComponent/NavComponent";
import ProductTable from "./ProductCard";
import ProductNav from "./ProductNav";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [filterColor, setFilterColor] = useState(""); // Thêm state cho màu

  // Hàm xử lý lọc theo loại
  const handleFilterType = (value) => {
    setFilterType(value);
    console.log("Lọc theo loại:", value);
  };

  // Hàm xử lý lọc theo chất liệu
  const handleFilterMaterial = (value) => {
    setFilterMaterial(value);
    console.log("Lọc theo chất liệu:", value);
  };

  // Hàm xử lý lọc theo màu
  const handleFilterColor = (value) => {
    setFilterColor(value);
    console.log("Lọc theo màu:", value);
  };

  return (
    <PageContainer>
      <NavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          <h1>Quản lý sản phẩm</h1>
          <ProductNav
          // onSearch={handleSearch}
          // onFilterType={handleFilterType}
          // onFilterMaterial={handleFilterMaterial}
          // onFilterColor={handleFilterColor} // Truyền props màu
          />

          {/* Bảng sản phẩm */}
          <ProductTable
          // searchTerm={searchTerm}
          // filterType={filterType}
          // filterMaterial={filterMaterial}
          // filterColor={filterColor} // Thêm props màu vào bảng
          />
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default ProductsPage;

// Styled components ở đây...

// Styled components
const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContainer = styled.div`
  flex: 1;
  margin-left: 300px; /* Khoảng cách cho NavComponent */
`;

const ContentContainer = styled.div`
  padding: 20px;
  padding-top: 80px; /* Thêm khoảng cách để tránh bị đè bởi HeaderComponent */
`;

const PageTitle = styled.h1`
  margin-bottom: 20px;
  font-size: 30px;
  font-weight: bold;
  color: #333;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;
