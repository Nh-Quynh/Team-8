import React, { useState, useEffect } from "react";
import { CameraOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../redux/slices/authSlice"; // Cập nhật đường dẫn tùy thuộc vào cấu trúc dự án của bạn
import InfoForm from "./InfoForm"; // Import InfoForm vào đây

// Styled components
const CardContainer = styled.div`
  margin: 20px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 40px);
  height: 300px;
  margin-right: 20px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;
`;

const UserImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;

const InfoContainer = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
`;

const InfoItem = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`;

const EditButton = styled(Button)`
  margin-top: auto;
  align-self: flex-start;
`;

const InfoCard = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);
  const [userInfo, SetUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/user/employee/get-details/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      SetUserInfo(data.data);
      dispatch(getUser(data.data));
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      message.error("Không thể lấy người dùng!");
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlePageReload = () => {
      fetchUser();
    };
    handlePageReload(); // Run on initial load

    const interval = setInterval(() => {
      fetchUser(); // Set interval to refresh data
    }, 15000); // Refresh every 10 seconds (adjust as needed)

    window.addEventListener("focus", handlePageReload); // Trigger fetch on page focus

    return () => {
      clearInterval(interval); // Clear interval on unmount
      window.removeEventListener("focus", handlePageReload); // Clean up event listener
    };
  }, [userId]);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <CardContainer>
        <ImageContainer>
          {userInfo?.image ? (
            <UserImage src={userInfo.image} alt="User Avatar" />
          ) : (
            <CameraOutlined style={{ fontSize: "120px", color: "#888" }} />
          )}
        </ImageContainer>
        <InfoContainer>
          <InfoItem>Username: {userInfo?.name || "Chưa có tên"}</InfoItem>
          <InfoItem>Họ và tên: {userInfo?.fullName || "Chưa có tên"}</InfoItem>
          <InfoItem>Email: {userInfo?.email || "Chưa có email"}</InfoItem>
          <InfoItem>
            Phone: {userInfo?.phone || "Chưa có số điện thoại"}
          </InfoItem>
          <InfoItem>
            Ngày sinh: {dayjs(userInfo?.birthday).format("DD/MM/YYYY")}
          </InfoItem>
          <InfoItem>Giới tính: {userInfo?.gender ? "Nữ" : "Nam"}</InfoItem>
          <InfoItem>Quê quán:{userInfo?.address || "Chưa có địa chỉ"}</InfoItem>
          <InfoItem>Quyền: {userInfo?.role || "Chưa có vai trò"}</InfoItem>
          <InfoItem>
            Trạng thái: {userInfo?.status ? "Hoạt động" : "Bị khóa"}
          </InfoItem>
          <EditButton
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Chỉnh sửa
          </EditButton>
        </InfoContainer>
      </CardContainer>

      {/* Hiển thị InfoForm khi bấm "Chỉnh sửa" */}
      <InfoForm
        isVisible={isModalVisible}
        onClose={handleModalClose}
        userInfo={userInfo}
      />
    </>
  );
};

export default InfoCard;
