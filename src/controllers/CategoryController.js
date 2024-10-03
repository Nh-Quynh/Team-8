const CategoryService = require("../services/CategoryService");

//Khoi tao loai san pham
const createCategory = async (req, res) => {
  try {
    const { id_category, name } = req.body;
    if (!id_category || !name) {
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

module.exports = {
  createCategory,
  getAllCategories,
};
