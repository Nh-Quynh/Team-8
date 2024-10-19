import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const DiscountTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDiscountId, setCurrentDiscountId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URI}/discount/get-all-discounts`
        );
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setDiscounts(data.data);
        } else {
          setDiscounts([]);
        }
      } catch (error) {
        console.error("Error fetching discounts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URI}/product/get-all-products`
        );
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchDiscounts();
    fetchProducts();
  }, []);

  const columns = [
    {
      title: "MGG",
      dataIndex: "discountId",
      key: "discountId",
    },
    {
      title: "% Giảm giá",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (text) => `${text}%`,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (productIds) => {
        if (!Array.isArray(productIds) || productIds.length === 0) {
          return "No products";
        }

        const productIdList = productIds
          .map((product) => product.productId)
          .join(", ");

        return productIdList.length > 0 ? productIdList : "No products found";
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn chỉnh sửa mã giảm giá này không?"
            onConfirm={() => handleEditDiscount(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<EditOutlined />}
              type="danger"
              // type="primary" // Changed to primary for better UX
            />
          </Popconfirm>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mã giảm giá này không?"
            onConfirm={() => handleDeleteDiscount(record.discountId)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeleteDiscount = async (discountId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/discount/delete-discount/${discountId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete discount");
      }

      setDiscounts((prevDiscounts) =>
        prevDiscounts.filter((discount) => discount.discountId !== discountId)
      );

      message.success("Discount deleted successfully!");
    } catch (error) {
      console.error("Error deleting discount:", error);
      message.error("Failed to delete discount. Please try again!");
    }
  };

  const handleAddDiscount = () => {
    setIsModalVisible(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleEditDiscount = (record) => {
    form.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
    });
    setIsModalVisible(true);
    setIsEditing(true);
    setCurrentDiscountId(record.discountId);
  };

  const addDiscount = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/discount/create-discount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      console.log("Values to be sent:", values);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Failed to add discount");
      }

      const newDiscount = await response.json();
      console.log("New Discount:", newDiscount);
      setDiscounts((prevDiscounts) => [...prevDiscounts, newDiscount]);

      message.success("Discount added successfully!");
    } catch (error) {
      console.error("Error adding discount:", error);
      message.error(
        error.message || "Failed to add discount. Please try again!"
      );
    }
  };

  const editDiscount = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/discount/update-discount/${currentDiscountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const {
        status,
        message: responseMessage,
        updatedDiscount,
      } = await response.json();

      // Kiểm tra phản hồi từ API
      if (status !== "OK" || !updatedDiscount) {
        throw new Error(
          responseMessage || "API did not return updated discount"
        );
      }

      // Cập nhật danh sách discount
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.discountId === currentDiscountId ? updatedDiscount : discount
        )
      );

      // Gọi hàm success từ Ant Design
      message.success("Discount edited successfully!");
    } catch (error) {
      console.error("Error editing discount:", error);
      message.error(
        error.message || "Failed to edit discount. Please try again!"
      );
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Chuyển đổi định dạng ngày tháng trước khi gửi
      values.startDate = values.startDate.format("DD/MM/YYYY");
      values.endDate = values.endDate.format("DD/MM/YYYY");
      values.products = values.products || []; // Bảo đảm có sản phẩm trong trường hợp không có

      if (isEditing) {
        await editDiscount(values);
      } else {
        await addDiscount(values);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error validating form:", error);
      message.error("Failed to submit form. Please check your input!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddDiscount}
        style={{ marginBottom: "16px" }}
      >
        New
      </Button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={discounts}
        rowKey="discountId"
        pagination={false}
      />
      <Modal
        title={isEditing ? "Edit Discount" : "Add Discount"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="discountId"
            label="Discount ID"
            rules={[
              { required: true, message: "Please input the discount ID!" },
            ]}
          >
            <Input placeholder="Enter discount ID" />
          </Form.Item>
          <Form.Item
            name="discountPercent"
            label="Discount Percent"
            rules={[
              { required: true, message: "Please input the discount percent!" },
            ]}
          >
            <Input min="0" type="number" placeholder="Enter discount percent" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="products"
            label="Products"
            rules={[
              {
                required: true,
                message: "Please select at least one product!",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Select products">
              {products.map((product) => (
                <Option key={product.productId} value={product.productId}>
                  {product.productName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountTable;
