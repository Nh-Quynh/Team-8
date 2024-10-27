import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SaleNavComponent from "../../components/NavComponent/SaleNavComponent"
import styled from "styled-components";
import { Card, Row, Col, Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { current } from "@reduxjs/toolkit";
const {Option} = Select;

const SaleHomePage = () => {
  const years = [];
  const currentYear = new Date().getFullYear();

  const [orderCountByStatus, setOrderCountByStatus] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  // create year list from 2023 to current year
  for (let year = 2023; year <= currentYear; year++) {
    years.push(year);
  }

  const handleChange = (value) => {
    setSelectedYear(value);
    fetchMonthlyRevenueByYear(value);
  };

  const fetchOrderCountByStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/order/get-order-count-by-status`
      )

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu thống kê trạng thái đơn hàng");
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error("Dữ liệu thống kê trạng thái đơn hàng không hợp lệ");
      }

      setOrderCountByStatus(data.data);
    }
    catch (error) {
      // message.error(error.message); // Hiển thị thông báo lỗi
      console.error(error);
    }
  };

  // create an array with 12 element corresponding to 12 month in a year
  const initializeMonthlyRevenue = () => {
    const months = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      price: 0
    }));
    return months;
  };

  // merge revenue data from backend with default data
  const mergeRevenueData = (defaultData, backendData) => {
    const dataMap = new Map(backendData.map(item => [item.month, item.price]));

    return defaultData.map(item => ({
      ...item,
      price: dataMap.get(item.month) || item.price
    }));
  };

  const fetchMonthlyRevenueByYear = async (year) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/order/get-monthly-revenue/${year}`
      )

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu thống kê doanh thu");
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error("Dữ liệu thống kê doanh thu hợp lệ");
      }

      const defaultData = initializeMonthlyRevenue();
      const mergedData = mergeRevenueData(defaultData, data.data);

      setMonthlyRevenue(mergedData);
    }
    catch (error) {
      // message.error(error.message); // Hiển thị thông báo lỗi
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderCountByStatus();
    fetchMonthlyRevenueByYear(currentYear);
  }, []);

  return (
    <PageContainer>
      <SaleNavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          <Row gutter={16}>
            <Col span={24}>
              <Card title="Thống kê đơn hàng theo trạng thái">
                <BarChart
                  width={600}
                  height={300}
                  data={orderCountByStatus}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Thống kê doanh thu">
                <Select
                  value={selectedYear}
                  style={{ width: 120, marginBottom: 20}}
                  onChange={handleChange}
                >
                  {years.map(year => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>

                <BarChart
                  width={600}
                  height={300}
                  data={monthlyRevenue}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="price" fill="#8884d8" />
                </BarChart>
              </Card>
            </Col>
          </Row>
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContainer = styled.div`
  flex: 1;
  margin-left: 250px; /* Khoảng cách cho NavComponent */
`;

const ContentContainer = styled.div`
  padding: 20px;
  padding-top: 80px; /* Thêm khoảng cách để tránh bị đè bởi HeaderComponent */
`;

export default SaleHomePage;