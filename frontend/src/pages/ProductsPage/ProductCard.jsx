import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log(
          "API URL:",
          `${process.env.REACT_APP_API_URI}/product/get-all-products`
        );
        const response = await fetch(
          `${process.env.REACT_APP_API_URI}/product/get-all-products`
        );
        const data = await response.json();
        console.log("Dữ liệu từ API:", data);
        setProducts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        message.error("Không thể lấy sản phẩm!");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm xử lý tìm kiếm

  const columns = [
    {
      title: "ID",
      dataIndex: "productId",
      key: "id",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "urlImage",
      key: "urlImage",
      render: (text, record) =>
        record.urlImage ? (
          <img
            src={record.urlImage}
            alt={record.name}
            style={{ width: "50px" }}
          />
        ) : (
          <CameraOutlined style={{ fontSize: "24px", color: "#aaa" }} />
        ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Chất liệu",
      dataIndex: "material",
      key: "material",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">Chỉnh sửa</Button>
          <Button type="danger">Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading} // Hiển thị trạng thái loading
    />
  );
};

export default ProductTable;
