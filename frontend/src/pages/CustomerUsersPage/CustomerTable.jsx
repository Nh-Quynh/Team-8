import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
} from "@ant-design/icons"; // Import icon

const CustomerTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URI}/user/getAll`
        );

        if (!response.ok) {
          throw new Error("Không thể lấy người dùng");
        }

        const data = await response.json();

        // Kiểm tra dữ liệu người dùng
        if (!data || !Array.isArray(data.data)) {
          throw new Error("Dữ liệu người dùng không hợp lệ");
        }

        // Cập nhật trạng thái người dùng
        setUsers(data.data);
      } catch (error) {
        message.error(error.message); // Hiển thị thông báo lỗi
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (record) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/user/delete-customer/${record._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa người dùng");
      }

      // Cập nhật lại danh sách người dùng
      setUsers(users.filter((user) => user._id !== record._id));
      message.success("Đã xóa người dùng thành công");
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  const handleToggleStatus = async (record) => {
    const accessToken = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/user/update-status/${record._id}`,
        {
          method: "PUT", // Sử dụng PUT để cập nhật trạng thái
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken}`, // Sử dụng Authorization cho token
          },
          body: JSON.stringify({ status: !record.status }), // Gửi trạng thái mới
        }
      );

      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
        const errorText = await response.text(); // Lấy phản hồi dạng text
        throw new Error(
          errorText || "Không thể cập nhật trạng thái người dùng"
        );
      }

      const updatedUser = await response.json(); // Nhận dữ liệu cập nhật từ server
      // Cập nhật lại danh sách người dùng sau khi thay đổi trạng thái
      const updatedUsers = users.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
      setUsers(updatedUsers);
      message.success("Đã cập nhật trạng thái người dùng thành công");
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "_id", // ID người dùng
    //   key: "_id",
    // },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender ? "Nữ" : "Nam"), // Hiển thị giới tính
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""), // Chuyển đổi ngày
    },

    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span>{status ? "Kích hoạt" : "Khóa"}</span> // Hiển thị trạng thái rõ ràng
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn thay đổi trạng thái người dùng này không?"
            onConfirm={() => handleToggleStatus(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type={record.status ? "danger" : "primary"}
              icon={record.status ? <UnlockOutlined /> : <LockOutlined />} // Thay đổi icon tùy theo trạng thái
            // Gọi chung một hàm
            />
          </Popconfirm>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này không?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="_id"
      loading={loading} // Hiển thị trạng thái loading
    />
  );
};

export default CustomerTable;
