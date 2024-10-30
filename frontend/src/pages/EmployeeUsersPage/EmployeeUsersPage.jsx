import React, { useState } from "react";
import styled from "styled-components";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import NavComponent from "../../components/NavComponent/NavComponent";
import EmployeeTable from "./EmployeeTable";

const EmployeeUsersPage = () => {
  return (
    <PageContainer>
      <NavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          {/* <h1>Quản lý người dùng</h1> */}
          <EmployeeTable />
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default EmployeeUsersPage;

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
