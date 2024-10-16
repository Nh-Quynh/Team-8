const DiscountService = require("../services/DiscountService");

const createDiscount = async (req, res) => {
  try {
    const { discountId, discountPercent, startDate, endDate, products } =
      req.body;

    // Kiểm tra các thuộc tính cần thiết
    if (
      !discountId ||
      !discountPercent ||
      !startDate ||
      !endDate ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing discount attribute or products array is empty",
      });
    }

    // Gọi dịch vụ để tạo discount
    const response = await DiscountService.createDiscount(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const getAllDiscount = async (req, res) => {
  try {
    const response = await DiscountService.getAllDiscount();

    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

// get discount with discount id from request parameters
const getDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const response = await DiscountService.getDiscount(discountId);

    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

// update discount with discount id from request parameters and data from request body
const updateDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const updatedData = req.body;

    const response = await DiscountService.updateDiscount(
      discountId,
      updatedData
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

// delete discount with discount id from request parameters
const deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const response = await DiscountService.deleteDiscount(discountId);

    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createDiscount,
  getAllDiscount,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
