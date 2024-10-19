import React from "react";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import NavComponent from "../../components/NavComponent/NavComponent";
import styled from "styled-components";
import { Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
// import { useSelector } from "react-redux"; test

const AdminHomePage = () => {
  const sampleProductCountByType = [
    { type: "Điện thoại", count: 100 },
    { type: "Máy tính xách tay", count: 80 },
    { type: "Phụ kiện", count: 50 },
    { type: "Tivi", count: 20 },
  ];
  const sampleProductCountByMaterial = [
    { material: "Nhựa", count: 120 },
    { material: "Kim loại", count: 60 },
    { material: "Gỗ", count: 40 },
    { material: "Thủy tinh", count: 30 },
  ];

  const sampleProductCountByColor = [
    { color: "Đen", count: 80 },
    { color: "Trắng", count: 70 },
    { color: "Đỏ", count: 50 },
    { color: "Xanh", count: 40 },
  ];

  // Dữ liệu cho sản phẩm bán chạy
  const sampleBestSellingProducts = [
    { name: "Điện thoại A", sold: 200 },
    { name: "Máy tính xách tay B", sold: 150 },
    { name: "Phụ kiện C", sold: 120 },
    { name: "Tivi D", sold: 100 },
  ];

  // const user = useSelector((state) => state.auth.user); // Lấy thông tin người dùng từ Redux
  return (
    <PageContainer>
      <NavComponent />
      <MainContainer>
        <HeaderComponent />
        <ContentContainer>
          <Row gutter={16}>
            <Col span={24}>
              <Card title="Thống kê sản phẩm theo loại">
                <BarChart
                  width={600}
                  height={300}
                  data={sampleProductCountByType}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Thống kê sản phẩm theo chất liệu">
                <BarChart
                  width={600}
                  height={300}
                  data={sampleProductCountByMaterial}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="material" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Thống kê sản phẩm theo màu">
                <BarChart
                  width={600}
                  height={300}
                  data={sampleProductCountByColor}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="color" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Thống kê sản phẩm bán chạy">
                <BarChart
                  width={600}
                  height={300}
                  data={sampleBestSellingProducts}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#ff7300" />
                </BarChart>
              </Card>
            </Col>
          </Row>
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default AdminHomePage;

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
