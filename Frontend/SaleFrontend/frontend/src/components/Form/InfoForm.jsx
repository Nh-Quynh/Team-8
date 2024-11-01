import React, { useState, useEffect, useMemo } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const InfoForm = ({ isVisible, onClose, userInfo }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const initialValues = useMemo(
    () => ({
      name: userInfo?.name || "",
      fullName: userInfo?.fullName || "",
      phone: userInfo?.phone || "",
      address: userInfo?.address || "",
      role: userInfo?.role || "",
      status: userInfo?.status ?? true,
      birthday: userInfo?.birthday ? dayjs(userInfo.birthday) : null,
      gender: userInfo?.gender || true,
      password: "",
      image: userInfo?.image || "",
    }),
    [userInfo]
  );

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
  }, [initialValues, form, isVisible, isFirstLoad, userInfo]);

  const handleFormSubmit = async (values) => {
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
      onCancel={() => {
        setFileList([]);
        setIsFirstLoad(true);
        onClose();
      }}
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
          label="UserName"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập userName" }]}
        >
          <Input placeholder="Nhập UserName" />
        </Form.Item>
        <Form.Item label="Họ tên" name="fullName">
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="birthday"
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const today = dayjs();
                const birthDate = dayjs(value).startOf("day");
                const age = today.diff(birthDate, "year");

                if (age < 18) {
                  return Promise.reject(
                    new Error(
                      "Ngày sinh không hợp lệ. Người dùng phải trên 18 tuổi."
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          <Select>
            <Option value={true}>Nữ</Option>
            <Option value={false}>Nam</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password">
          <Input.Password placeholder="Đổi mật khẩu" />
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

export default InfoForm;
