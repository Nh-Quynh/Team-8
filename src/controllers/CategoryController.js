// CategoryController

const CategoryService = require("../services/CategoryService");

//Khoi tao loai san pham
const createCategory = async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    if (!categoryId || !name) {
      return res.status(400).json({
        status: "ERR",
        message: "Name or ID not filled in",
      });
    }
    const newCategory = await CategoryService.createCategory(req.body);
    return res.status(200).json(newCategory);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//Lay danh sach loai san pham
const getAllCategories = async (req, res) => {
  try {
    const response = await CategoryService.getAllCategories();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
// const getCategoryById = async (req, res) => {
//   try {
//     const { id } = req.params; // Lấy ID từ params
//     const response = await CategoryService.getCategoryById(id); // Gọi service để lấy loại sản phẩm
//     if (response.category) {
//       return res.status(200).json(response);
//     } else {
//       return res.status(404).json(response);
//     }
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };

module.exports = {
  createCategory,
  getAllCategories,
  // getCategoryById
}