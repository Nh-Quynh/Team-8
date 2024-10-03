const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const Color = require("../models/ColorModel");
const Quantity = require("../models/QuantityModel");
const Material = require("../models/MaterialModel");

const createProduct = async (newProduct) => {
  const {
    id_product,
    name,
    price,
    description,
    urlImage,
    category,
    material,
    color,
    quantity,
  } = newProduct;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    let product = await Product.findOne({ id_product });
    let categoryObj = await Category.findOne({ name: category });
    let colorObj = await Color.findOne({ name: color });
    let materialObj = await Material.findOne({ name: material });

    // Nếu chưa tồn tại, tạo các đối tượng mới
    if (!categoryObj) categoryObj = await Category.create({ name: category });
    if (!materialObj) materialObj = await Material.create({ name: material });
    if (!colorObj) colorObj = await Color.create({ name: color });

    // Kiểm tra lại sau khi tạo mới
    console.log("Category after creation: ", categoryObj);
    console.log("Material after creation: ", materialObj);
    console.log("Color after creation: ", colorObj);

    // Nếu sản phẩm đã tồn tại
    if (product) {
      let existingQuantity = await Quantity.findOne({
        product: product._id,
        color: colorObj._id,
      });

      if (existingQuantity) {
        // Cập nhật số lượng sản phẩm
        existingQuantity.quantity =
          Number(existingQuantity.quantity) + Number(quantity);
        // existingQuantity.quantity += quantity
        await existingQuantity.save();
        return {
          status: "OK",
          message: "Updated existing product quantity",
          product,
          updateQuantity: existingQuantity,
        };
      } else {
        // Tạo mới quantity cho sản phẩm
        const newQuantity = await Quantity.create({
          product: product._id,
          color: colorObj._id,
          quantity,
        });
        return {
          status: "OK",
          message: "Created new quantity for existing product",
          product,
          quantity: newQuantity,
        };
      }
    }

    // Nếu sản phẩm chưa tồn tại, tiến hành tạo sản phẩm mới
    product = await Product.create({
      id_product,
      name,
      price,
      description,
      urlImage,
      category: categoryObj._id,
      material: materialObj._id,
    });

    // Tạo mới quantity cho sản phẩm mới
    const newQuantity = await Quantity.create({
      product: product._id,
      color: colorObj._id,
      quantity,
    });

    return {
      status: "OK",
      message: "Created new product with quantity",
      product,
      quantity: newQuantity,
    };
  } catch (e) {
    // In ra lỗi để dễ debug
    console.error("Error in createProduct service:", e);
    throw new Error(e.message);
  }
};

module.exports = {
  createProduct,
};
