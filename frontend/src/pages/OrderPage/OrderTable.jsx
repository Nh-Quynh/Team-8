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
  Tag,
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons"; // Import icon
import styled from "styled-components";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(""); // Trạng thái tìm kiếm
  const [isFormVisible, setIsFormVisible] = useState(false); // Trạng thái hiển thị form
  const [form] = Form.useForm(); // Tạo form từ Ant Design

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/order/get-all-orders`
      );

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu đơn hàng");
      }

      const data = await response.json();

      console.log('DATA', data.data)
      
      // Kiểm tra dữ liệu người dùng
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ");
      }

      // Cập nhật trạng thái người dùng
      setOrders(data.data);
    }
    catch (error) {
      message.error(error.message); // Hiển thị thông báo lỗi
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const fetchOrderStatus = async () => {
      try {
        const allStatus = await fetch(
          `${process.env.REACT_APP_API_URI}/status/get-all-status`,
        );

        if (!allStatus.ok) {
          throw new Error("Không thể lấy dữ liệu trạng thái đơn hàng");
        }

        const data = await allStatus.json();

        // Kiểm tra dữ liệu trạng thái đơn hàng
        if (!data || !Array.isArray(data.data)) {
          throw new Error("Dữ liệu trạng thái đơn hàng không hợp lệ");
        }

        // Cập nhật dữ liệu trạng thái đơn hàng
        setOrderStatus(data.data);
      }
      catch (error) {
        message.error(error.message); // Hiển thị thông báo lỗi
        console.error(error);
      }
    };

    fetchOrderStatus();
  }, []);

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

  const searchOrderById = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/order/get-details/${searchId}`
      )

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu đơn hàng");
      }

      const data = await response.json();
      console.log('DATA', data)

      if (!data) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ");
      }


      setOrders(data.data);
      console.log('ORDER', orders)
    }
    catch (error) {
      message.error(error.message); // Hiển thị thông báo lỗi
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (searchId) {
      await searchOrderById();
    }
    else {
      await fetchOrders();
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id", // ID người dùng
      key: "_id",
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderDetail",
      key: "orderDetail",      
      render: orderDetails => (
        <Space direction="vertical">
          {orderDetails.map((detail) => (
            <ProductDetails key={detail._id}>
              <div>
                <img src={detail.productQuantity.product.urlImage} height="50px" />
              </div>

              <div style={{left: 0, marginTop: 5}}>
                <Tag key={detail._id}>
                  {detail.productQuantity.product.name} x{detail.quantity}
                </Tag>
              </div>
            </ProductDetails>
          ))}
        </Space>
      ),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Phương thức vận chuyển",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
    {
      title: "Chi phí vận chuyển",
      dataIndex: "deliveryFee",
      key: "deliveryFee",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""), // Chuyển đổi ngày
    },

    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      // display payment method's name
      render: (paymentMethod) => paymentMethod ? paymentMethod.name : "",
    }, {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // display status's name
      render: (status) => status ? status.name : "",
    }
  ];

  // extract the Option property from the Select object
  const { Option } = Select;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          type="text"
          value={searchId}
          placeholder="Tìm kiếm đơn hàng"
          onChange={(e) => setSearchId(e.target.value)}
          style={{ width: 200, marginRight: 16 }}
        />

        <Button
          type="primary"
          onClick={handleSearch}
          icon={<SearchOutlined />} 
          style={{ marginRight: 16 }}
        >
          Tìm kiếm
        </Button>

        <Select defaultValue="Lọc theo trạng thái" style={{ width: 200 }} >
          {
            orderStatus.map(status => (
              <Option key={status._id} value={status._id}>
                {status.name}
              </Option>
            ))
          }
        </Select>

        <Button
          type="primary"
          onClick={handleSearch}
          icon={<UndoOutlined />} 
          style={{ marginLeft: 16 }}
        >
          Đặt lại bộ lọc
        </Button>
      </div>

      <Table
        columns={columns}
        // check if orders is an array and adjust
        dataSource={Array.isArray(orders) ? orders : [orders]}
        // rowKey="_id"
        loading={loading} // Hiển thị trạng thái loading
      />
    </div>
  );
};

const ProductDetails = styled.div`
  display: table;
  column-count: 2;
  margin-bottom: 10px;
`

export default OrderTable;