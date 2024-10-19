import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Input,
  Form,
  Modal,
  Select, // Nhập Select từ antd
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons"; // Import icon

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm
    const [isFormVisible, setIsFormVisible] = useState(false); // Trạng thái hiển thị form
    const [form] = Form.useForm(); // Tạo form từ Ant Design

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URI}/order/get-all-orders`
                );
        
                if (!response.ok) {
                    throw new Error("Không thể lấy dữ liệu đơn hàng");
                }
        
                const data = await response.json();
        
                // Kiểm tra dữ liệu người dùng
                if (!data || !Array.isArray(data.orders)) {
                    throw new Error("Dữ liệu đơn hàng không hợp lệ");
                }
        
                // Cập nhật trạng thái người dùng
                setOrders(data.orders);
            } catch (error) {
                message.error(error.message); // Hiển thị thông báo lỗi
                console.error(error);
            } finally {
                setLoading(false);
            }
        }; 
        
        fetchOrders();
    }, []);

    

    const handleNewOrder = () => {
        setIsFormVisible(true); // Hiển thị form khi nhấn nút New
        form.resetFields(); // Đặt lại các trường trong form
      };
    
      const handleFormSubmit = async (values) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URI}/user/employee/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );
    
          if (!response.ok) {
            throw new Error("Không thể tạo người dùng mới");
          }
    
          const newUser = await response.json();
          setOrders([...orders, newUser]); // Thêm người dùng mới vào danh sách
          message.success("Đã thêm người dùng mới thành công");
          setIsFormVisible(false); // Đóng form sau khi tạo người dùng
        } catch (error) {
          message.error(error.message);
          console.error(error);
        }
      };
    
      const handleDelete = async (record) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URI}/user/employee/delete-employee/${record._id}`,
            { method: "DELETE" }
          );
    
          if (!response.ok) {
            throw new Error("Không thể xóa người dùng");
          }
    
          // Cập nhật lại danh sách người dùng
        //   setOrders(users.filter((user) => user._id !== record._id));
          message.success("Đã xóa người dùng thành công");
        } catch (error) {
          message.error(error.message);
          console.error(error);
        }
      };
    
      const handleToggleStatus = async (record) => {
        try {
          const accessToken = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
          const response = await fetch(
            `${process.env.REACT_APP_API_URI}/user/employee/update-status/${record._id}`,
            {
              method: "PUT", // Sử dụng PUT để cập nhật trạng thái
              headers: {
                "Content-Type": "application/json",
                token: `Bearer ${accessToken}`, // Sử dụng Authorization cho token
              },
              body: JSON.stringify({ status: !record.status }), // Gửi trạng thái mới
            }
          );
    
          if (!response.ok) {
            throw new Error("Không thể cập nhật trạng thái người dùng");
          }
    
          // Cập nhật lại danh sách người dùng sau khi thay đổi trạng thái
        //   const updatedUsers = users.map((user) =>
        //     user._id === record._id ? { ...user, status: !user.status } : user
        //   );
        //   setUsers(updatedUsers);
          message.success("Đã cập nhật trạng thái người dùng thành công");
        } catch (error) {
          message.error(error.message);
          console.error(error);
        }
      };
    
      const handleRoleChange = async (value, record) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URI}/user/employee/update-role/${record._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ role: value }),
            }
          );
    
          if (!response.ok) {
            throw new Error("Không thể cập nhật vai trò người dùng");
          }
    
          // Cập nhật lại danh sách người dùng sau khi thay đổi vai trò
        //   const updatedUsers = users.map((user) =>
        //     user._id === record._id ? { ...user, role: value } : user
        //   );
        //   setUsers(updatedUsers);
        //   message.success("Đã cập nhật vai trò người dùng thành công");
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
            <span>{status ? "Kích hoạt" : "Khóa"}</span> // Hiển thị trạng thái
          ),
        },
        {
          title: "Vai trò",
          dataIndex: "role",
          key: "role",
          render: (role, record) => (
            <Select
              defaultValue={role}
              onChange={(value) => handleRoleChange(value, record)} // Gọi hàm khi chọn vai trò mới
            >
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="sales">Sales</Select.Option>
            </Select>
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
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={handleNewOrder}
              icon={<PlusOutlined />} // Thêm biểu tượng add
              style={{ marginRight: 16 }}
            >
              New
            </Button>
            <Input
              placeholder="Tìm kiếm đơn hàng"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200, marginRight: 16 }}
            />
          </div>
          {/* <Table
            columns={columns}
            dataSource={users} // Hiển thị tất cả người dùng
            rowKey="_id"
            loading={loading} // Hiển thị trạng thái loading
          /> */}
          <Modal
            title="Tạo đơn hàng mới"
            visible={isFormVisible}
            onCancel={() => setIsFormVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleFormSubmit}>
              <Form.Item
                name="orderId"
                label="Mã đơn hàng"
                rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Quyền"
                rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
              >
                <Select>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="sales">Sales</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="fullName"
                label="Họ và Tên"
                // rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="birthday"
                label="Ngày sinh"
                // rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Giới tính"
                // rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              >
                <Select>
                  <Select.Option value={true}>Nữ</Select.Option>
                  <Select.Option value={false}>Nam</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                // rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tạo người dùng
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      );
};

export default OrderTable;