import React from "react";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/slices/authSlice";
import { Col, Dropdown, Menu, message } from "antd"; // Nhập Spin cho chỉ báo đang tải
import {
  CaretDownOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  MarqueeText,
} from "./style";

const HeaderComponent = () => {
  // Nhận email người dùng như một prop
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.user?.email || ""); // Lấy email từ Redux

  const mutation = useMutation({
    mutationFn: () => UserService.logoutEmployee(),
    onSuccess: (data) => {
      if (data.status === "OK") {
        message.success("Đăng xuất thành công!");
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        dispatch(logoutAdmin());
        navigate("/sign-in");
      } else {
        message.error("Có lỗi xảy ra khi đăng xuất!");
      }
    },
    onError: (error) => {
      message.error(error.message || "Đăng xuất thất bại");
    },
  });

  const handleLogout = () => {
    mutation.mutate(); // Thực hiện logout
  };

  // Tạo menu cho dropdown
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined style={{ marginRight: "8px" }} />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <WrapperHeader>
        <Col span={6}>
          <WrapperTextHeader>Team 8</WrapperTextHeader>
        </Col>
        <Col span={12}>
          <MarqueeText>Chào mừng đến trang Admin của Team 8</MarqueeText>
        </Col>
        <Col span={6}>
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: "30px" }} />
            <div style={{ marginLeft: "10px" }}>
              <span>{userEmail}</span> {/* Hiển thị email người dùng */}
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <CaretDownOutlined style={{ marginLeft: "5px" }} />
              </Dropdown>
            </div>
          </WrapperHeaderAccount>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
