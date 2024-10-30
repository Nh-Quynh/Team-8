import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusOutlined,
  CameraOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Upload,
  DatePicker,
  Select,
  message,
} from "antd";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {getUser} from "../../redux/slices/authSlice"

const { Option } = Select;

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
  border-radius: 10px;
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

// Hàm formatDate
const formatDate = (isoDate) => {
  if (!isoDate) return ""; // Kiểm tra xem isoDate có hợp lệ không
  const dateOnly = isoDate.split("T")[0]; // Lấy phần trước 'T'
  const [year, month, day] = dateOnly.split("-"); // Tách thành các phần năm, tháng, ngày
  return `${day}/${month}/${year}`; // Gán chuỗi ngày đã format
};

// Form chỉnh sửa thông tin
const InfoForm = ({ isVisible, onClose, userInfo }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false); // Khai báo biến showPassword
  const initialValues = {
    fullName: userInfo?.fullName || "",
    phone: userInfo?.phone || "",
    address: userInfo?.address || "",
    birthday: userInfo?.birthday ? moment(userInfo.birthday) : null,
    gender: userInfo?.gender || true,
    password: "",
    image: userInfo?.image || "",
  };
  const [fileList, setFileList] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // useEffect(() => {
  //   form.setFieldsValue(initialValues); // Cập nhật giá trị ban đầu khi userInfo thay đổi
  // }, [initialValues, form]);

  useEffect(() => {
    form.setFieldsValue(initialValues);

    if (isVisible && isFirstLoad) {
      if (userInfo?.image) {
        setFileList([
          {
            uid: "-1",
            name: "current-image",
            status: "done",
            url: userInfo.image,
          },
        ]);
      }
      setIsFirstLoad(false);
    }
  }, [initialValues, form, isVisible, isFirstLoad, userInfo])

  const userId = useSelector((state) => state.auth.user?._id);
  const handleFormSubmit = async (values) => {
    // try {
    //   const response = await fetch(
    //     `${process.env.REACT_APP_API_URI}/user/employee/update-employee/${userId}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(values),
    //     }
    //   );

    //   const data = await response.json();
    //   dispatch(getUser(data));
    //   //   console.log(data)

    //   if (data.status === "OK") {
    //     // Cập nhật thành công, có thể thực hiện thêm hành động như thông báo cho người dùng
    //     onClose(); // Đóng modal
    //     message.success("Cập nhật thành công!");
    //   } else {
    //     // Xử lý lỗi
    //     message.error("Cập nhật không thành công!");
    //   }
    // } catch (error) {
    //   console.error("Lỗi cập nhật thông tin:", error);
    //   message.error("Đã xảy ra lỗi, vui lòng thử lại!");
    // }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const updatedValues = {
        ...values,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        image: fileList.length > 0 ? fileList[0].url : null,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/user/employee/update-employee/${userInfo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedValues),
        }
      );
      const data = await response.json();
      if (data.status === "OK") {
        onClose();
        message.success("Cập nhật thành công!");
      } else {
        message.error("Cập nhật không thành công!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  const handleUploadChange = async (info) => {
    const file = info.fileList[0];
    if (file && file.originFileObj) {
      const formData = new FormData();
      formData.append("file", file.originFileObj);
      formData.append("upload_preset", "Your_cloud_image");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/drzjvhpwi/image/upload`,
          formData
        );

        const urlImage = response.data.secure_url;
        setFileList([
          { uid: file.uid, name: file.name, status: "done", url: urlImage },
        ]);
        message.success(`Đã tải lên thành công: ${file.name}`);
      } catch (error) {
        message.error(`Lỗi khi tải hình ảnh lên Cloudinary: ${file.name}`);
      }
    } else {
      setFileList(info.fileList);
    }
  };

  return (
    <Modal
      open={isVisible}
      title="Chỉnh sửa thông tin"
      onCancel={onClose}
      // appear position of Modal
      style={{ top: '20px', right: 'unset', bottom: 'unset' }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
        >
          <Input />
        </Form.Item>
        <Form.Item label="SĐT" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="birthday">
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Giới tính" name="gender">
          <Select>
            <Option value={true}>Nữ</Option>
            <Option value={false}>Nam</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
        >
          <Input.Password
            type={showPassword ? "text" : "password"}
            addonAfter={
              <span onClick={() => setShowPassword(!showPassword)}>
                {/* {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />} */}
              </span>
            }
          />
        </Form.Item>
        <Form.Item label="Hình ảnh">
          <Upload
            name="image"
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            onRemove={() => {
              setFileList([]);
              message.success("Đã xóa ảnh thành công.");
            }}
          >
            {fileList.length === 0 ? (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            ) : null}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Component InfoCard
const SaleInfoCard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);
  const [userInfo, SetUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();


  // get employee information
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
    }, 1000); // Refresh every 10 seconds (adjust as needed)

    window.addEventListener("focus", handlePageReload); // Trigger fetch on page focus

    return () => {
      clearInterval(interval); // Clear interval on unmount
      window.removeEventListener("focus", handlePageReload); // Clean up event listener
    };
  }, [userId]);

  const handleModalClose = () => {
    fetchUser();
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
          <InfoItem>Username: {userInfo?.name}</InfoItem>
          <InfoItem>Họ và tên: {userInfo?.fullName}</InfoItem>
          <InfoItem>Email: {userInfo?.email}</InfoItem>
          <InfoItem>Phone: {userInfo?.phone}</InfoItem>
          <InfoItem>Ngày sinh: {formatDate(userInfo?.birthday)}</InfoItem>
          <InfoItem>Giới tính: {userInfo?.gender ? "Nữ" : "Nam"}</InfoItem>
          <InfoItem>Quê quán: {userInfo?.address}</InfoItem>
          <InfoItem>Quyền: {userInfo?.role}</InfoItem>
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

      <InfoForm
        isVisible={isModalVisible}
        onClose={handleModalClose}
        userInfo={userInfo} // Truyền userInfo vào InfoForm
      />
    </>
  );
};

export default SaleInfoCard;
