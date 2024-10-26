import React, {useState} from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  HomeOutlined,
  SettingOutlined,
  UserAddOutlined,
  ProductOutlined,
  DashboardOutlined,
  TagOutlined,
  SolutionOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom
import { CameraOutlined } from "@ant-design/icons"; // Import CameraOutlined

const items = [
  {
    key: "home", // Thêm khóa cho mục Home
    label: "Trang chủ", // Nhãn cho mục Home
    icon: <DashboardOutlined />, // Nhập DashboardOutlined từ Ant Design
    link: "/sale/home", // Liên kết cho mục Home
  },
  {
    key: "order_management", // Thêm khóa cho mục Home
    label: "Quản lý đơn hàng", // Nhãn cho mục Home
    icon: <SolutionOutlined />, // Nhập DashboardOutlined từ Ant Design
    link: "/sale/order-management", // Liên kết cho mục Home
  },
  {
    key: "personal_information", // Thêm khóa cho mục Home
    label: "Quản lý thông tin cá nhân", // Nhãn cho mục Home
    icon: <SettingOutlined />, // Nhập DashboardOutlined từ Ant Design
    link: "/sale/personal-information", // Liên kết cho mục Home
  },
]

const SaleNavComponent = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng
  const userName = useSelector((state) => state.auth.user?.name || ""); // Lấy name từ Redux
  const userRole = useSelector((state) => state.auth.user?.role || ""); // Lấy role từ Redux
  const userImage = useSelector((state) => state.auth.user?.image || ""); // Lấy ảnh từ Redux

  // Hàm xử lý sự kiện khi click vào một mục trong menu
  const onClick = (e) => {
    console.log("click ", e);
    const item = items.find((item) => item.key === e.key);
    if (item) {
      navigate(item.link); // Chuyển hướng tới đường dẫn tương ứng
    }
  };

  return (
    <NavContainer>
      <Profile>
        <Avatar
          size={60}
          src={userImage || ""} // Chỉ hiển thị ảnh nếu có
          icon={!userImage ? <CameraOutlined /> : null} // Hiển thị icon nếu không có ảnh
        />
        <div style={{ marginLeft: "10px" }}>
          <Typography.Text strong>{userName}</Typography.Text>
          <br />
          <Typography.Text type="secondary">{userRole}</Typography.Text>
        </div>
      </Profile>
      <Menu
        onClick={onClick}
        style={{
          width: 235,
          height: "100vh", // Chiều cao cố định
          overflow: "auto", // Cuộn nếu cần
        }}
        defaultSelectedKeys={["customer_management"]}
        mode="inline"
        items={items.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
      />
    </NavContainer>
  );
}

const NavContainer = styled.div`
  height: 100vh; /* Chiếm toàn bộ chiều cao màn hình */
  width: 235px; /* Chiều rộng của nav */
  background-color: #f7f7f7; /* Màu nền của nav */
  position: fixed; /* Cố định nav bên trái màn hình */
  top: 0; /* Gắn nó ở trên cùng */
  left: 0; /* Gắn nó ở bên trái */
  z-index: 1000; /* Đảm bảo nav ở trên cùng */
`;

// Styled component cho Profile
const Profile = styled.div`
  display: flex; /* Sử dụng flexbox để bố trí */
  background-color: #f7f7f7;
  align-items: center; /* Căn giữa các mục theo chiều dọc */
  padding: 20px; /* Khoảng cách bên trong */
  border-bottom: 4px solid #f0f0f0; /* Đường viền ngăn cách */
`;

const NavControllerButton = styled.button`
  border: none;
  background-color: #f7f7f7;
`;

export default SaleNavComponent;