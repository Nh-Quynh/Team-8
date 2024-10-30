import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SaleNavComponent from "../../components/NavComponent/SaleNavComponent"
import styled from "styled-components";
import { Card, Row, Col} from "antd";
import OrderTable from "./OrderTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// const PageContainer = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const MainContainer = styled.div`
//   flex: 1;
//   margin-left: 235px; /* Khoảng cách cho NavComponent */
// `;

// const ContentContainer = styled.div`
//   padding: 20px;
//   padding-top: 80px; /* Thêm khoảng cách để tránh bị đè bởi HeaderComponent */
// `;

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

const OrderPage = () => {
  return (
    <PageContainer>
      <SaleNavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          <OrderTable />
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default OrderPage;