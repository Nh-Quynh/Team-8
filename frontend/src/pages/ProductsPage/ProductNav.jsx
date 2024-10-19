import React, { useState } from "react";
import { Button, Input, Select, Space, Modal, Form } from "antd";

const { Search } = Input;
const { Option } = Select;

const ProductNav = ({
  onSearch,
  onFilterType,
  onFilterMaterial,
  onFilterColor,
  onNewProduct,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newItemType, setNewItemType] = useState(""); // Để xác định đang thêm loại sản phẩm hay chất liệu

  // Mở modal để thêm loại sản phẩm hoặc chất liệu mới
  const openNewModal = (itemType) => {
    setNewItemType(itemType);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log(`${newItemType} mới:`, newValue);
    setIsModalVisible(false);
    // Logic xử lý loại sản phẩm hoặc chất liệu mới có thể được thêm ở đây
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  const handleNewValueChange = (e) => {
    setNewValue(e.target.value); // Cập nhật giá trị mới cho loại sản phẩm hoặc chất liệu
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Thanh tìm kiếm */}
        <Search
          placeholder="Tìm kiếm sản phẩm"
          enterButton="Tìm kiếm"
          onSearch={onSearch}
          style={{ width: 300, marginRight: "20px" }}
        />

        {/* Lọc theo loại sản phẩm */}
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <Select
            placeholder="Chọn loại sản phẩm"
            onChange={onFilterType}
            style={{ width: 200, marginRight: "10px" }}
          >
            <Option value="Điện thoại">Điện thoại</Option>
            <Option value="Máy tính xách tay">Máy tính xách tay</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
            <Option value="Tivi">Tivi</Option>
          </Select>
          <Button
            type="primary"
            onClick={() => openNewModal("Loại sản phẩm")}
            style={{ marginRight: "20px" }}
          >
            New
          </Button>
        </div>

        {/* Lọc theo chất liệu */}
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <Select
            placeholder="Chọn chất liệu"
            onChange={onFilterMaterial}
            style={{ width: 200, marginRight: "10px" }}
          >
            <Option value="Kim loại">Kim loại</Option>
            <Option value="Nhựa">Nhựa</Option>
            <Option value="Thủy tinh">Thủy tinh</Option>
            <Option value="Gỗ">Gỗ</Option>
          </Select>
          <Button
            type="primary"
            onClick={() => openNewModal("Chất liệu")}
            style={{ marginRight: "20px" }}
          >
            New
          </Button>
        </div>

        {/* Lọc theo màu */}
        <Select
          placeholder="Chọn màu"
          onChange={onFilterColor}
          style={{ width: 200 }}
        >
          <Option value="Đỏ">Đỏ</Option>
          <Option value="Xanh">Xanh</Option>
          <Option value="Vàng">Vàng</Option>
          <Option value="Đen">Đen</Option>
        </Select>
      </div>

      <div>
        {/* Nút thêm sản phẩm mới */}
        <Button type="primary" onClick={onNewProduct}>
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Modal thêm loại sản phẩm hoặc chất liệu mới */}
      <Modal
        title={`Thêm ${newItemType} mới`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label={`Nhập ${newItemType} mới`}>
            <Input
              placeholder={`Nhập ${newItemType} mới`}
              value={newValue}
              onChange={handleNewValueChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductNav;
