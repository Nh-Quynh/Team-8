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

//Cap nhat
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const data = req.body;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const response = await CategoryService.updateCategory(categoryId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const response = await CategoryService.deleteCategory(categoryId);
    return res.status(200).json(response);
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

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const response = await CategoryService.getCategoryById(categoryId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
  getCategoryById,
};
