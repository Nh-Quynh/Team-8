import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Space,
    message,
    Input,
    Popconfirm,
    Modal,
    Upload,
    Form,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    CameraOutlined,
    EditOutlined,
} from "@ant-design/icons"; // Import icon

const NewsTable = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState(""); // Trạng thái tìm kiếm
    const [isFormOpen, setIsFormOpen] = useState(false); // Trạng thái hiển thị form
    const [form] = Form.useForm(); // Tạo form từ Ant Design
    const [fileList, setFileList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchNews = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_API_URI}/news/get-all-news`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${accessToken}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu tin tức");
            }

            const data = await response.json();

            // Kiểm tra dữ liệu người dùng
            if (!data || !Array.isArray(data.data)) {
                throw new Error("Dữ tin tức hàng không hợp lệ");
            }

            // Cập nhật trạng thái người dùng
            setNews(data.data);
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
        fetchNews();
        if (selectedNews) {
            form.setFieldsValue(selectedNews);
            setImagePreview(selectedNews.urlImage);
            setFileList([{ uid: "-1", url: selectedNews.urlImage }]);
        }
    }, [selectedNews, form]);

    const handleCreateNews = async (values) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const updatedValues = {
                ...values,
                urlImage: fileList.length > 0 ? fileList[0].url : null,
            };

            const response = await fetch(
                `${process.env.REACT_APP_API_URI}/news/create-news`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(updatedValues),
                }
            );

            if (!response.ok) {
                throw new Error("Không thể tạo tin tức mới");
            }

            const newNews = await response.json();
            setNews([...news, newNews]); // Thêm người dùng mới vào danh sách
            message.success("Đã thêm tin tức mới thành công");

            form.resetFields();
            setFileList([]);
            setImagePreview(null);
            setIsFormOpen(false); // Đóng form sau khi tạo người dùng
            fetchNews();
        } catch (error) {
            message.error(error.message);
            console.error(error);
        }
    };

    const handleUpdateNews = async (values) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const updatedValues = {
                ...values,
                urlImage: fileList.length > 0 ? fileList[0].url : null,
            };

            const response = await fetch(
                `${process.env.REACT_APP_API_URI}/news/update-news/${values.newsId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(updatedValues),
                }
            );

            if (!response.ok) {
                throw new Error("Không thể cập nhật tin tức");
            }

            const newNews = await response.json();
            setNews([...news, newNews]); // Thêm người dùng mới vào danh sách
            message.success("Đã cập nhật tin tức thành công");

            form.resetFields();
            setFileList([]);
            setImagePreview(null);
            setIsFormOpen(false); // Đóng form sau khi tạo người dùng
            fetchNews();
        } catch (error) {
            message.error(error.message);
            console.error(error);
        }
    }

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
                setImagePreview(urlImage);
                message.success(`Đã tải lên thành công: ${file.name}`);
            } catch (error) {
                message.error(`Lỗi khi tải hình ảnh lên Cloudinary: ${file.name}`);
            }
        } else {
            setFileList(info.fileList);
        }
    }

    const showForm = () => {
        setSelectedNews(null);
        setIsFormOpen(true);
    }

    const showEditModal = (news) => {
        setSelectedNews(news);
        setIsFormOpen(true);
    }

    const handleCancelForm = () => {
        form.resetFields(); // Reset form khi hủy
        setFileList([]); // Reset danh sách file
        setIsFormOpen(false);
        setSelectedNews(null);
        setImagePreview(null);
    }

    const searchNewsById = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_API_URI}/news/get-news/${searchId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${accessToken}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu tin tức");
            }

            const data = await response.json();

            if (!data.data) {
                throw new Error("Không tìm thấy tin tức");
            }

            setNews(data.data);
        }
        catch (error) {
            message.error(error.message); // Hiển thị thông báo lỗi
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchId) {
            await searchNewsById();
        }
        else {
            await fetchNews();
        }
    };

    const handleDelete = async (record) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URI}/news/delete-news/${record.newsId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Không thể xóa tin tức");
            }

            // Cập nhật lại danh sách người dùng
            // setUsers(users.filter((user) => user._id !== record._id));
            fetchNews();
            message.success("Đã xóa tin tức thành công");
        } catch (error) {
            message.error(error.message);
            console.error(error);
        }
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "newsId",
            key: "newsId",
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            width: 200,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Hình ảnh",
            dataIndex: "urlImage",
            key: "urlImage",
            width: 150,
            render: (text, record) =>
                record.urlImage ? (
                    <img
                        src={record.urlImage}
                        alt={record.name}
                        style={{ width: "50px" }}
                    />
                ) : (
                    <CameraOutlined style={{ fontSize: "35px", color: "#aaa" }} />
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    />

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tin tức này không?"
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
                    onClick={showForm}
                    icon={<PlusOutlined />} // Thêm biểu tượng add
                    style={{ marginRight: 16 }}
                >
                    Thêm tin tức
                </Button>

                <Input
                    type="text"
                    value={searchId}
                    placeholder="Tìm kiếm tin tức"
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{ width: 200, marginRight: -10 }}
                />

                <Button
                    type="primary"
                    onClick={handleSearch}
                    icon={<SearchOutlined />}
                    style={{ marginRight: 16 }}
                />
            </div>

            <Table
                columns={columns}
                // check if orders is an array and adjust it
                dataSource={Array.isArray(news) ? news : [news]}
                // rowKey="_id"
                loading={loading} // Hiển thị trạng thái loading
            />

            <Modal
                title={selectedNews ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
                open={isFormOpen}
                onCancel={handleCancelForm}
                footer={null}
                width={800}
                style={{ top: '20px', right: 'unset', bottom: 'unset' }}
            >
                <Form form={form} onFinish={selectedNews ? handleUpdateNews : handleCreateNews} onCancel={handleCancelForm}>
                    <Form.Item
                        name="newsId"
                        label="ID tin tức"
                        rules={[{ required: true, message: "Vui lòng nhập id tin tức!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea style={{ height: 250 }} />
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {selectedNews ? "Lưu tin tức" : "Tạo tin tức"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NewsTable;