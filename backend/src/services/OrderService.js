const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Customer = require("../models/CustomerModel");
const OrderDetail = require("../models/OrderDetailModel");
const PaymentMethod = require("../models/PaymentMethodModel");
// const Discount = require("../models/DiscountModel");
const Quantity = require("../models/QuantityModel");
const Status = require("../models/Status.Model");
const Product = require("../models/ProductModel");
const Invoice = require("../models/InvoiceModel");
const DiscountService = require("../services/DiscountService");
const ObjId = mongoose.Types.ObjectId;
const StatusService = require("../services/StatusService");
const sendEmail = require("../middleware/emailConfig");
const { promises } = require("nodemailer/lib/xoauth2");
const generateOrderID = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
};
// function generateUniqueSeries() {
//   const timestamp = Date.now(); // lấy thời gian hiện tại tính bằng milliseconds
//   return `SERIES-${timestamp}`;
// }

// console.log(generateUniqueSeries());

// console.log(generateUniqueSeries());
const createUniqueOrderID = async () => {
  let orderId;
  let isUnique = false;

  while (!isUnique) {
    orderId = generateOrderID();
    const existingOrder = await Order.findOne({ orderId }); // Kiểm tra xem orderId có tồn tại trong database
    isUnique = !existingOrder; // Duy nhất nếu không tìm thấy
  }

  return orderId;
};
const generateUniqueSeries = () => {
  const timestamp = Date.now(); // lấy thời gian hiện tại tính bằng milliseconds
  return `SERIES-${timestamp}`;
};

const createInvoice = async (VAT, orderId, finalPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!VAT || !orderId || !finalPrice) {
        return {
          status: "ERR",
          message: "Missing invoice attributes or products is not an array",
        };
      }
      const orderObj = await Order.findOne({ orderID: orderId });
      if (!orderObj) {
        return {
          status: "ERR",
          message: "order undefined",
        };
      }
      const invoiceNew = await Invoice.create({
        seriesNumber: generateUniqueSeries(),
        VAT: VAT,
        repeatDate: Date.now(),
        order: orderObj._id,
        finalPrice: finalPrice,
      });
      resolve({
        status: "OK",
        message: "Create invoice success",
        data: invoiceNew,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "An error occurred while creating the invoice.",
      });
    }
  });
};
const getInvoiceByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const invoice = await Invoice.findOne({ order: orderId });
      if (!invoice) {
        return {
          status: "ERR",
          message: "invoice undefined",
        };
      }
      resolve({
        status: "OK",
        message: "Get invoice success",
        data: invoice,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const createOrder = (userId, newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        itemIds,
        deliveryMethod,
        deliveryFee,
        address,
        paymentMethod,
        VAT,
      } = newOrder;

      // Kiểm tra người dùng hợp lệ
      const checkUser = await Customer.findById(userId);
      if (!checkUser) {
        return reject({ status: "ERR", message: "The user is undefined" });
      }

      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ customer: userId });
      if (!cart) {
        return reject({ status: "ERR", message: "Cart not found" });
      }
      // Kiểm tra số lượng của từng item
      const insufficientItems = [];
      const validItems = [];

      for (const itemId of itemIds) {
        const item = cart.items.find((item) => item._id.toString() === itemId);
        if (!item) {
          insufficientItems.push({ itemId, message: "Item not found in cart" });
          continue;
        }

        const quantityObj = await Quantity.findById(item.quantityId);
        if (!quantityObj) {
          insufficientItems.push({ itemId, message: "Quantity not found" });
          continue;
        }

        const requestedQuantity = item.quantity;
        if (requestedQuantity > quantityObj.quantity) {
          insufficientItems.push({ itemId, message: "Insufficient quantity" });
        } else {
          validItems.push(item);
        }
      }

      // Kiểm tra nếu không có mặt hàng hợp lệ
      if (validItems.length === 0) {
        return resolve({
          status: "ERR",
          message: "No valid items to create an order",
          details: insufficientItems, // Trả về thông tin các mặt hàng không hợp lệ
        });
      }

      let totalAmount = 0; // Lưu tổng tiền chưa giảm
      let totalDiscount = 0; // Lưu tiền giảm
      const orderDetails = []; // Lưu mảng id detail

      for (const item of validItems) {
        const quantityValid = await Quantity.findById(item.quantityId);
        const product = await Product.findById(quantityValid.product);

        const discounts = await DiscountService.getDiscountByProductId(
          product._id
        );
        // Tạo detail
        const orderDetail = await OrderDetail.create({
          productQuantity: item.quantityId,
          quantity: item.quantity,
        });
        orderDetails.push(orderDetail._id);

        // Cập nhật số lượng còn lại trong kho
        quantityValid.quantity -= item.quantity;
        await quantityValid.save();

        // Xóa item khỏi giỏ hàng
        const cartObj = await Cart.updateOne(
          { customer: userId },
          { $pull: { items: { _id: item._id } } }
        );
        console.log(cartObj);
        // Tính toán giảm giá
        if (discounts.status === "OK") {
          for (const discount of discounts.data) {
            const discountAmount =
              ((product.price * discount.discountPercent) / 100) *
              item.quantity;
            totalDiscount += discountAmount;
          }
        }

        totalAmount += product.price * item.quantity;
        console.log("Current Total Amount:", totalAmount);
      }
      let checkPaymentMethod;
      if (paymentMethod == "Thanh toán online") {
        checkPaymentMethod = await PaymentMethod.findOne({
          name: paymentMethod,
          status: true,
        });
        if (!checkPaymentMethod) {
          checkPaymentMethod = await PaymentMethod.create({
            name: paymentMethod,
            status: true,
          });
        }
      } else {
        checkPaymentMethod = await PaymentMethod.findOne({
          name: paymentMethod,
        });
        if (!checkPaymentMethod) {
          checkPaymentMethod = await PaymentMethod.create({
            name: paymentMethod,
          });
        }
      }
      if (totalDiscount > totalAmount) totalDiscount = totalAmount;
      // const totalPrice = totalAmount - totalDiscount +  Number(deliveryFee);
      const totalPrice = totalAmount - totalDiscount;
      let finalPrice;

      finalPrice = totalPrice + deliveryFee + (VAT * totalPrice) / 100;

      const status = await StatusService.getStatusDefault();
      const orderId = await createUniqueOrderID();
      const orderNew = await Order.create({
        orderID: orderId,
        userId: checkUser._id,
        orderDetail: orderDetails,
        totalPrice: finalPrice,
        deliveryMethod,
        deliveryFee,
        orderDate: Date.now(),
        address,
        paymentMethod: checkPaymentMethod._id,
        status: status,
      });
      // if (VAT) {
      const invoice = await createInvoice(VAT, orderId, finalPrice);
      // }
      resolve({
        status: "OK",
        message: "Create order success",
        data: orderNew,
        totalDiscount: totalDiscount,
        totalAmount: totalAmount,
        finalPrice: finalPrice,
        invoice: invoice,
      });
    } catch (e) {
      console.error("Error creating order:", e);
      reject({
        status: "ERR",
        message: e.message || "An error occurred while creating the order.",
      });
    }
  });
};
const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // mongoose.set('debug', true)

      const orders = await Order.find()
        .populate("paymentMethod", "name")
        .populate("status", "name")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: [
              {
                path: "product",
                select: "name price",
              },
              {
                path: "images",
                select: "imageUrl",
              }
            ]
          },
        })
        .populate("userId", "name email");

      resolve({
        status: "OK",
        message: "Get all orders",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrdersHistory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // mongoose.set('debug', true)

      // {orderDate: -1} will sort orders in descending order
      // date format in mongodb: yyyy-mm-dd
      const ordersSort = { orderDate: -1 };
      const orders = await Order.find()
        .sort(ordersSort)
        .populate("paymentMethod")
        .populate("status")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: [
              {
                path: "product",
                select: "name price",
              },
              {
                path: "images",
                select: "imageUrl",
              }
            ]
          },
        })
        .populate("userId", "name email");

      resolve({
        status: "OK",
        message: "Orders history",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetails = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ orderID: orderId })
        .populate("paymentMethod")
        .populate("status")
        .populate("orderDetail")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: [
              {
                path: "product",
                select: "name price",
              },
              {
                path: "images",
                select: "imageUrl", // Lấy trường `imageUrl`
              },
            ],
          },
        })
        .populate("userId", "name email");

      resolve({
        status: "OK",
        message: "Order details",
        data: order,
      });
    } catch (e) {
      console.error("Error fetching order details:", e); // Thêm log lỗi để kiểm tra
      reject(e);
    }
  });
};

const formatCurrency = (value) => {
  const formattedValue = (value * 1000).toLocaleString("vi-VN");
  return formattedValue.endsWith(",000")
    ? formattedValue.slice(0, -4) + " đ"
    : formattedValue + " đ";
};

const updateOrderStatus = (orderId, orderStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: new ObjId(orderStatus) },
        { new: true }
      )
        .populate("status")
        .populate("userId", "name email")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
              select: "name price urlImage",
            },
          },
        });
      const formattedTotalPrice = formatCurrency(updatedOrder.totalPrice);
      // send email to customer when the order is changed status to delivered
      if (updatedOrder.status.name === "Đang giao") {
        const productList = updatedOrder.orderDetail
          .map(
            (_product) =>
              `\t\t${_product.productQuantity.product.name} \tx ${_product.quantity}`
          )
          .join("\n");

        const emailContent = `Kính gửi ${updatedOrder.userId.name}, 
          \nChúng tôi rất vui mừng thông báo rằng đơn hàng ${updatedOrder.orderID} của bạn đã được chuẩn bị xong và đang trên đường đến địa chỉ của bạn! 
          \n**Thông tin đơn hàng:** 
          \n\t- Mã đơn hàng: [Mã đơn hàng] 
          \n\t- Sản phẩm:
          \n${productList}
          \n\t-Tổng thanh toán: ${formattedTotalPrice}
          \n\nNếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào, đừng ngần ngại liên hệ với chúng tôi qua email này hoặc trang chủ của cửa hàng. 
          \nCảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi! 
          \n\nTrân trọng, 
          \nLL&Q Store`;

        sendEmail(
          updatedOrder.userId.email,
          `Đơn hàng ${updatedOrder.orderID} đang được giao`,
          emailContent
        );
      }

      // send email to customer when the order is changed status to delivered successfully
      if (updatedOrder.status.name === "Đã giao") {
        const productList = updatedOrder.orderDetail
          .map(
            (_product) =>
              `\t\t${_product.productQuantity.product.name} \tx ${_product.quantity}`
          )
          .join("\n");

        const emailContent = `Kính gửi ${updatedOrder.userId.name}, 
          \nChúng tôi rất vui mừng thông báo rằng đơn hàng ${updatedOrder.orderID} giao thành công đến địa chỉ của bạn! 
          \n**Thông tin đơn hàng:** 
          \n\t- Mã đơn hàng: [Mã đơn hàng] 
          \n\t- Sản phẩm:
          \n${productList}
          \n\t-Tổng thanh toán:${formattedTotalPrice}
          \n\nChúng tôi hy vọng bạn hài lòng với sản phẩm đã nhận. Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào, đừng ngần ngại liên hệ với chúng tôi qua email này hoặc truy cập trang chủ của cửa hàng. 
          \nNếu bạn hài lòng với dịch vụ của chúng tôi, hãy để lại đánh giá và phản hồi của bạn tại trang chủ của cửa hàng. Phản hồi của bạn là vô cùng quan trọng để chúng tôi không ngừng cải thiện chất lượng dịch vụ. 
          \n\nCảm ơn bạn đã mua sắm tại LL&Q Store! 
          \nTrân trọng, 
          \nLL&Q Store`;

        sendEmail(
          updatedOrder.userId.email,
          `Đơn hàng ${updatedOrder.orderID} được giao thành công`,
          emailContent
        );
      }

      resolve({
        status: "OK",
        message: "Update order status successful",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      mongoose.set("debug", true);

      // Tìm đơn hàng theo ID và lấy chi tiết sản phẩm
      const order = await Order.findById(orderId)
        .populate("status")
        .populate("orderDetail");

      if (order === null) {
        return resolve({
          status: "OK",
          message: "The order does not exist",
        });
      }

      const orderStatus = order.status.name;

      // Kiểm tra trạng thái đơn hàng
      if (orderStatus === "Bị hủy") {
        return resolve({
          status: "OK",
          message: "The order was already cancelled",
          data: order,
        });
      } else if (
        // orderStatus === "Đang chuẩn bị" ||
        orderStatus === "Đang chờ duyệt"
      ) {
        // Cập nhật trạng thái đơn hàng sang "Bị hủy"
        const canceledStatus = await Status.findOne({ name: "Bị hủy" });
        await Invoice.findOneAndDelete({ order: order._id });
        // Duyệt qua các mặt hàng trong OrderDetail để hoàn lại số lượng kho
        for (const detail of order.orderDetail) {
          const quantityObj = await Quantity.findById(detail.productQuantity);
          if (quantityObj) {
            quantityObj.quantity += detail.quantity; // Cộng lại số lượng về kho
            await quantityObj.save();
          }
        }

        const canceledOrder = await Order.findByIdAndUpdate(
          orderId,
          { status: canceledStatus._id },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "The order was cancelled and stock quantities updated",
          data: canceledOrder,
        });
      } else {
        resolve({
          status: "OK",
          message: "You cannot cancel this order",
          reason_orderStatus: order.status.name,
        });
      }
    } catch (e) {
      console.error("Error canceling order:", e);
      reject({
        status: "ERR",
        message: e.message || "An error occurred while canceling the order.",
      });
    }
  });
};
const getOrderbyStatus = async (userId, statusName) => {
  // Tìm trạng thái bằng tên
  const status = await Status.findOne({ name: statusName });

  // Kiểm tra xem trạng thái có tồn tại không
  if (!status) {
    throw new Error("Status not found");
  }

  const orders = await Order.find({
    userId: userId, // Sử dụng ObjectId đã khởi tạo
    status: status._id, // Sử dụng ObjectId của trạng thái đã tìm
  })
    .populate("paymentMethod")
    .populate("status"); // Populate các trường liên quan nếu cần

  return {
    status: "OK",
    message: "Orders by status",
    orders: orders,
  };
};

const fillOrderByStatus = (statusId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ status: statusId })
        .populate("paymentMethod")
        .populate("status")
        .populate("orderDetail")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
              select: "name price urlImage",
            },
          },
        });

      resolve({
        status: "OK",
        message: "Order details",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrdersCountByStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // use aggregate to group orders by status and count the quantity of each status.
      const orders = await Order.aggregate([
        {
          $lookup: {
            // join with collection 'status'
            from: "status",
            // current collection attribute
            localField: "status",
            // foreign collection (status) attribute
            foreignField: "_id",
            // array contains data that combine with 'status' collection
            as: "statusDetails",
          },
        },
        {
          // split each element in the array into separate documents.
          $unwind: "$statusDetails",
        },
        {
          // group documents and count the number
          $group: {
            _id: "$statusDetails.name",
            count: { $sum: 1 },
          },
        },
      ]);

      resolve({ status: "OK", data: orders });
    } catch (e) {
      reject(e);
    }
  });
};

const getMonthlyRevenue = (year) => {
  return new Promise(async (resolve, reject) => {
    try {
      const revenue = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$orderDate" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            price: "$totalRevenue",
          },
        },
      ]);

      resolve({ status: "OK", data: revenue });
    } catch (e) {
      reject(e);
    }
  });
};

const resetOrderInvoice = async () => {
  try {
    await Order.deleteMany({});
    await OrderDetail.deleteMany({});
    await Invoice.deleteMany({});

    return { status: "OK" };
  } catch (e) {
    throw e;
  }
};

const getCountFailOrder = async (userId) => {
  try {
    const statusObj = await Status.findOne({ name: "Giao không thành công" });
    if (!statusObj)
      throw new Error("Không tìm thấy status 'Giao không thành công'");

    const statusId = new mongoose.Types.ObjectId(statusObj._id);
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const countFail = await Order.aggregate([
      { $match: { userId: userIdObj, status: statusId } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);

    const result = countFail[0]?.count || 0;
    console.log("Kết quả count:", result);
    return { status: "OK", data: result, statusObj };
  } catch (e) {
    console.error("Lỗi:", e);
    throw e;
  }
};

const getTotalRevenue = async () => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null, // Không nhóm theo bất kỳ trường nào
          totalRevenue: { $sum: "$totalPrice" }, // Tính tổng totalPrice
        },
      },
    ]);

    const result = revenue[0]?.totalRevenue || 0; // Đảm bảo giá trị trả về là 0 nếu không có dữ liệu

    return { status: "OK", data: result };
  } catch (e) {
    console.error("Lỗi:", e);
    throw e;
  }
};

const getTotalSales = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find()
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
            },
          },
        });

      const productSales = {};

      orders.forEach((order) => {
        order.orderDetail.forEach((detail) => {
          const product = detail.productQuantity.product;
          if (!productSales[product.name]) {
            productSales[product.name] = 0;
          }
          productSales[product.name] += detail.quantity;
        })
      })

      // convert productSales to an array and sort it
      const sortedProductSales = Object.entries(productSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity);

      resolve({
        status: "OK",
        message: "Get total sales",
        data: sortedProductSales,
      });
    } catch (e) {
      throw e;
    }
  });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersHistory,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  getOrderbyStatus,
  fillOrderByStatus,
  getOrdersCountByStatus,
  getMonthlyRevenue,
  getInvoiceByOrderId,
  resetOrderInvoice,
  getCountFailOrder,
  getTotalRevenue,
  getTotalSales,
};
