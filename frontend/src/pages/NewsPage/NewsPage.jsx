import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SaleNavComponent from "../../components/NavComponent/SaleNavComponent"
import styled from "styled-components";
import { Card, Row, Col} from "antd";
import NewsTable from "./NewsTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

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

const NewsPage = () => {
  return (
    <PageContainer>
      <SaleNavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          <NewsTable />
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default NewsPage;